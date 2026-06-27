import { useState, useCallback, useEffect } from 'react';
import { Pengeluaran, PesanPenasihat, ProfilPengguna, AnalisisPenasihat, RingkasanKategori, KategoriPengeluaran } from '@/types';
import { analisisPengeluaran, obrolanDenganPenasihat } from '@/lib/groq';
import { gunakanPesan } from '@/context/ToastContext';
import { PETA_KATEGORI } from '@/constants/categories';

export const gunakanPenasihat = (profilPengguna: ProfilPengguna | null) => {
  const { tampilkanPesan } = gunakanPesan();
  const [analisis, aturAnalisis] = useState<AnalisisPenasihat | null>(null);
  const [riwayatObrolan, aturRiwayatObrolan] = useState<PesanPenasihat[]>([]);
  const [sedangMemuat, aturSedangMemuat] = useState<boolean>(false);
  const [sedangMemuatObrolan, aturSedangMemuatObrolan] = useState<boolean>(false);
  const [kesalahan, aturKesalahan] = useState<string | null>(null);

  // Memuat data penasihat dari localStorage agar persisten jika tersedia
  useEffect(() => {
    const analisisTersimpan = localStorage.getItem('smart_spending_advisor_analysis');
    const riwayatTersimpan = localStorage.getItem('smart_spending_advisor_history');
    if (analisisTersimpan) {
      try {
        aturAnalisis(JSON.parse(analisisTersimpan));
      } catch (e) {
        console.error('Error parsing cached analysis:', e);
      }
    }
    if (riwayatTersimpan) {
      try {
        const diurai = JSON.parse(riwayatTersimpan) as any[];
        aturRiwayatObrolan(
          diurai.map((item) => ({
            ...item,
            waktu: new Date(item.waktu)
          }))
        );
      } catch (e) {
        console.error('Error parsing cached chat history:', e);
      }
    }
  }, []);

  const mulaiAnalisis = useCallback(async (daftarPengeluaran: Pengeluaran[]) => {
    aturSedangMemuat(true);
    aturKesalahan(null);
    try {
      // Filter pengeluaran berdasarkan kalender bulan saat ini
      const sekarang = new Date();
      const tahunSekarang = sekarang.getFullYear();
      const bulanSekarang = sekarang.getMonth();
      const pengeluaranBulanSekarang = daftarPengeluaran.filter((exp) => {
        const bagian = exp.tanggal.split('-');
        if (bagian.length !== 3) return false;
        const tahun = parseInt(bagian[0], 10);
        const bulan = parseInt(bagian[1], 10) - 1; // Indeks dimulai dari 0
        return tahun === tahunSekarang && bulan === bulanSekarang;
      });

      // Hitung statistik untuk konteks yang kaya
      const totalPengeluaran = pengeluaranBulanSekarang.reduce((jumlah, exp) => jumlah + exp.nominal, 0);
      const jumlahTransaksi = pengeluaranBulanSekarang.length;

      // Rincian kategori
      const totalPerKategori: Record<string, number> = {};
      pengeluaranBulanSekarang.forEach((exp) => {
        totalPerKategori[exp.kategori] = (totalPerKategori[exp.kategori] || 0) + exp.nominal;
      });

      const rincianKategori: RingkasanKategori[] = Object.entries(totalPerKategori)
        .map(([kat, total]) => {
          const persentase = totalPengeluaran > 0 ? (total / totalPengeluaran) * 100 : 0;
          const kategori = kat as KategoriPengeluaran;
          return {
            kategori,
            total,
            persentase: Math.round(persentase * 100) / 100,
            warna: PETA_KATEGORI[kategori]?.warna || '#94A3B8'
          };
        })
        .sort((a, b) => b.total - a.total);

      // 5 transaksi terbesar
      const transaksiTerbesar = [...pengeluaranBulanSekarang]
        .sort((a, b) => b.nominal - a.nominal)
        .slice(0, 5);

      // Sisa hari dalam bulan ini
      const totalHariDalamBulan = new Date(tahunSekarang, bulanSekarang + 1, 0).getDate();
      const sisaHariDalamBulan = totalHariDalamBulan - sekarang.getDate();
      
      const stringTanggalSekarang = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(sekarang);

      const parameter = {
        namaPengguna: profilPengguna?.nama || 'Pengguna',
        pendapatanBulanan: profilPengguna?.pendapatanBulanan || 0,
        totalPengeluaran,
        jumlahTransaksi,
        rincianKategori,
        transaksiTerbesar,
        tanggalSekarang: stringTanggalSekarang,
        sisaHariDalamBulan,
      };

      let respons: AnalisisPenasihat;
      try {
        respons = await analisisPengeluaran(parameter);
      } catch (err: any) {
        console.error('Error in analyzeExpenses raw API call or parse:', err);
        throw err;
      }

      aturAnalisis(respons);
      localStorage.setItem('smart_spending_advisor_analysis', JSON.stringify(respons));

      // Atur ulang riwayat obrolan lanjutan ketika analisis baru dimulai
      aturRiwayatObrolan([]);
      localStorage.removeItem('smart_spending_advisor_history');
      tampilkanPesan('Analisis selesai!', 'success');
    } catch (err: any) {
      console.error('Error getting AI analysis:', err);
      aturKesalahan(err.message || 'Gagal menganalisis keuangan');
      tampilkanPesan(err.message || 'Gagal menganalisis keuangan', 'danger');
    } finally {
      aturSedangMemuat(false);
    }
  }, [profilPengguna, tampilkanPesan]);

  const kirimPesanLanjutan = useCallback(async (daftarPengeluaran: Pengeluaran[], pesanPengguna: string) => {
    if (!pesanPengguna.trim()) return;
    
    const objekPesanPengguna: PesanPenasihat = {
      peran: 'user',
      konten: pesanPengguna,
      waktu: new Date()
    };

    const riwayatDiperbarui = [...riwayatObrolan, objekPesanPengguna];
    aturRiwayatObrolan(riwayatDiperbarui);
    aturSedangMemuatObrolan(true);

    try {
      // Filter pengeluaran berdasarkan kalender bulan saat ini
      const sekarang = new Date();
      const tahunSekarang = sekarang.getFullYear();
      const bulanSekarang = sekarang.getMonth();
      const pengeluaranBulanSekarang = daftarPengeluaran.filter((exp) => {
        const bagian = exp.tanggal.split('-');
        if (bagian.length !== 3) return false;
        const tahun = parseInt(bagian[0], 10);
        const bulan = parseInt(bagian[1], 10) - 1; // Indeks dimulai dari 0
        return tahun === tahunSekarang && bulan === bulanSekarang;
      });

      const riwayatMapping = riwayatDiperbarui.map(pesan => ({
        peran: pesan.peran,
        konten: pesan.konten
      }));

      const jawaban = await obrolanDenganPenasihat(
        pengeluaranBulanSekarang,
        riwayatMapping,
        pesanPengguna,
        profilPengguna?.pendapatanBulanan || 0,
        analisis
      );
      
      const objekPesanAsisten: PesanPenasihat = {
        peran: 'assistant',
        konten: jawaban,
        waktu: new Date()
      };

      const riwayatAkhir = [...riwayatDiperbarui, objekPesanAsisten];
      aturRiwayatObrolan(riwayatAkhir);
      localStorage.setItem('smart_spending_advisor_history', JSON.stringify(riwayatAkhir));
    } catch (err: any) {
      console.error('Error in AI follow up chat:', err);
      tampilkanPesan('Gagal mengirim pesan', 'danger');
    } finally {
      aturSedangMemuatObrolan(false);
    }
  }, [riwayatObrolan, tampilkanPesan, profilPengguna, analisis]);

  const aturUlangAnalisis = useCallback(() => {
    aturAnalisis(null);
    aturRiwayatObrolan([]);
    localStorage.removeItem('smart_spending_advisor_analysis');
    localStorage.removeItem('smart_spending_advisor_history');
  }, []);

  return {
    analisis,
    riwayatObrolan,
    sedangMemuat,
    sedangMemuatObrolan,
    kesalahan,
    mulaiAnalisis,
    kirimPesanLanjutan,
    aturUlangAnalisis
  };
};
