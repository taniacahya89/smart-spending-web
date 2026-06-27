import { Pengeluaran, RingkasanKategori, AnalisisPenasihat } from '@/types';

const kunciApi = import.meta.env.VITE_GROQ_API_KEY || '';

if (!kunciApi) {
  console.warn('Kunci API Groq tidak ditemukan. Konfigurasikan VITE_GROQ_API_KEY di .env');
}

export interface ParameterPromptGroq {
  namaPengguna: string;
  pendapatanBulanan: number;
  totalPengeluaran: number;
  jumlahTransaksi: number;
  rincianKategori: RingkasanKategori[];
  transaksiTerbesar: Pengeluaran[];
  tanggalSekarang: string;
  sisaHariDalamBulan: number;
}

export const buatPromptGroq = (parameter: ParameterPromptGroq): string => {
  const rasio = parameter.pendapatanBulanan > 0
    ? Math.round((parameter.totalPengeluaran / parameter.pendapatanBulanan) * 100)
    : 0;
  const sisaUang = parameter.pendapatanBulanan - parameter.totalPengeluaran;

  const barisKategori = parameter.rincianKategori
    .map(kat => `- ${kat.kategori}: Rp ${kat.total.toLocaleString('id-ID')} (${kat.persentase}%)`)
    .join('\n');

  const barisTransaksi = parameter.transaksiTerbesar
    .map(t => `- Rp ${t.nominal.toLocaleString('id-ID')} | ${t.kategori} | "${t.deskripsi || ''}" | ${t.tanggal}`)
    .join('\n');

  return `Kamu adalah advisor keuangan personal untuk mahasiswa Indonesia.
Gunakan bahasa Indonesia yang santai, spesifik, dan tidak generik.

=== DATA KEUANGAN BULAN INI ===
Nama: ${parameter.namaPengguna}
Pendapatan bulanan: Rp ${parameter.pendapatanBulanan.toLocaleString('id-ID')}
Total pengeluaran bulan ini: Rp ${parameter.totalPengeluaran.toLocaleString('id-ID')}
Rasio pengeluaran: ${rasio}% dari pendapatan
Sisa uang: Rp ${sisaUang.toLocaleString('id-ID')}
Hari ini: ${parameter.tanggalSekarang}, sisa hari di bulan ini: ${parameter.sisaHariDalamBulan} hari
Jumlah transaksi: ${parameter.jumlahTransaksi} transaksi

=== BREAKDOWN PER KATEGORI ===
${barisKategori || 'Belum ada transaksi'}

=== 5 TRANSAKSI TERBESAR BULAN INI ===
${barisTransaksi || 'Belum ada transaksi'}

=== ACUAN PENILAIAN ===
- Hemat: pengeluaran < 50% pendapatan
- Normal: pengeluaran 50-80% pendapatan
- Boros: pengeluaran > 80% pendapatan
- Jika pendapatan = 0, gunakan penilaian "tidak_dapat_dinilai"

Respond HANYA dalam JSON valid, tanpa markdown, tanpa backtick, tanpa teks lain:
{
  "ringkasan": "2-3 kalimat spesifik tentang pola pengeluaran, sebutkan angka nyata",
  "penilaian": "hemat" atau "normal" atau "boros" atau "tidak_dapat_dinilai",
  "alasan_penilaian": "1-2 kalimat alasan berdasarkan angka dan rasio",
  "saran": [
    "saran spesifik 1 berdasarkan kategori terbesar user",
    "saran spesifik 2 berdasarkan pola transaksi user",
    "saran spesifik 3 untuk sisa hari di bulan ini"
  ],
  "highlight": "1 insight menarik atau tidak terduga dari data, sebutkan angka"
}`;
};

const panggilGroq = async (prompt: string): Promise<string> => {
  const respons = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${kunciApi}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!respons.ok) {
    const errorJson = await respons.json();
    throw new Error(errorJson?.error?.message || 'Gagal berkomunikasi dengan AI.');
  }

  const dataJson = await respons.json();
  return dataJson.choices[0].message.content;
};

export const analisisPengeluaran = async (parameter: ParameterPromptGroq): Promise<AnalisisPenasihat> => {
  if (!kunciApi) {
    throw new Error('Groq API key belum dikonfigurasi. Set VITE_GROQ_API_KEY di .env');
  }

  const prompt = buatPromptGroq(parameter);
  const responsTeks = await panggilGroq(prompt);

  const indeksMulai = responsTeks.indexOf('{');
  const indeksAkhir = responsTeks.lastIndexOf('}');

  if (indeksMulai === -1 || indeksAkhir === -1) {
    throw new Error('Format respons AI tidak mengandung objek JSON valid.');
  }

  try {
    return JSON.parse(responsTeks.substring(indeksMulai, indeksAkhir + 1)) as AnalisisPenasihat;
  } catch {
    throw new Error('Gagal memahami format analisis dari AI (JSON tidak valid).');
  }
};

export const obrolanDenganPenasihat = async (
  daftarPengeluaran: Pengeluaran[],
  riwayat: { peran: 'user' | 'assistant'; konten: string }[],
  pesanBaru: string,
  pendapatanBulanan: number = 0,
  analisisSebelumnya: AnalisisPenasihat | null = null
): Promise<string> => {
  if (!kunciApi) {
    throw new Error('Groq API key belum dikonfigurasi.');
  }

  const pengeluaranDiformat = daftarPengeluaran.map(e => ({
    tanggal: e.tanggal,
    nominal: e.nominal,
    kategori: e.kategori,
    deskripsi: e.deskripsi || '-',
  }));

  const totalPengeluaran = daftarPengeluaran.reduce((jumlah, e) => jumlah + e.nominal, 0);
  const rasio = pendapatanBulanan > 0 ? Math.round((totalPengeluaran / pendapatanBulanan) * 100) : 0;
  const sisaUang = pendapatanBulanan - totalPengeluaran;

  const teksRiwayat = riwayat
    .slice(0, -1) // abaikan pesan user terakhir karena sudah ada di pesanBaru
    .map(pesan => `${pesan.peran === 'user' ? 'Pengguna' : 'Advisor'}: ${pesan.konten}`)
    .join('\n');

  const konteksAnalisis = analisisSebelumnya
    ? `
=== HASIL ANALISIS SEBELUMNYA ===
Penilaian: ${analisisSebelumnya.penilaian}
Ringkasan: ${analisisSebelumnya.ringkasan}
Alasan: ${analisisSebelumnya.alasan_penilaian}
`
    : '';

  const prompt = `Kamu adalah advisor keuangan personal untuk mahasiswa Indonesia.
Gunakan bahasa Indonesia yang santai, bersahabat, dan berbobot.
Jawab berdasarkan data nyata yang diberikan, JANGAN minta data tambahan dari user.

=== DATA KEUANGAN BULAN INI ===
Total pengeluaran: Rp ${totalPengeluaran.toLocaleString('id-ID')}
Pendapatan bulanan: Rp ${pendapatanBulanan.toLocaleString('id-ID')}
Rasio pengeluaran: ${rasio}%
Sisa uang: Rp ${sisaUang.toLocaleString('id-ID')}
${konteksAnalisis}
=== DETAIL TRANSAKSI BULAN INI ===
${JSON.stringify(pengeluaranDiformat, null, 2)}

=== RIWAYAT PERCAKAPIAN ===
${teksRiwayat}

=== PERTANYAAN USER SEKARANG ===
${pesanBaru}

Jawab langsung berdasarkan data di atas. Sebutkan angka spesifik kalau relevan.`;

  return await panggilGroq(prompt);
};