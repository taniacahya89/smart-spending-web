/**
 * Memformat nilai numerik menjadi gaya mata uang Rupiah Indonesia.
 * Contoh: 50000 -> Rp 50.000
 */
export const formatRupiah = (nominal: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(nominal);
};

/**
 * Memformat string tanggal ISO "YYYY-MM-DD" menjadi tanggal Indonesia yang mudah dibaca.
 * Contoh: "2026-06-22" -> "22 Juni 2026"
 */
export const formatTanggal = (stringTanggal: string): string => {
  if (!stringTanggal) return '';
  const bagian = stringTanggal.split('-');
  if (bagian.length !== 3) return stringTanggal;
  const tahun = parseInt(bagian[0], 10);
  const bulan = parseInt(bagian[1], 10) - 1; // indeks dimulai dari 0
  const hari = parseInt(bagian[2], 10);
  
  const objekTanggal = new Date(tahun, bulan, hari);
  if (isNaN(objekTanggal.getTime())) return stringTanggal;
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(objekTanggal);
};

/**
 * Mendapatkan tanggal lokal saat ini dalam format "YYYY-MM-DD".
 */
export const dapatkanStringTanggalLokal = (d: Date = new Date()): string => {
  const tahun = d.getFullYear();
  const bulan = String(d.getMonth() + 1).padStart(2, '0');
  const hari = String(d.getDate()).padStart(2, '0');
  return `${tahun}-${bulan}-${hari}`;
};

/**
 * Merapikan nama kategori untuk keseragaman format jika diperlukan.
 */
export const formatKategori = (kategori: string): string => {
  if (!kategori) return '';
  return kategori.trim();
};

/**
 * Memformat input angka standar untuk menyertakan pemisah ribuan sebagai pembantu teks.
 * Contoh: 1000000 -> "1.000.000"
 */
export const formatPemisahRibuan = (nilai: number | string): string => {
  const angka = typeof nilai === 'number' ? nilai : parseFloat(nilai.replace(/[^\d]/g, ''));
  if (isNaN(angka)) return '';
  return angka.toLocaleString('id-ID');
};
