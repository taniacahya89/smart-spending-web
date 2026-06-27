import React, { useMemo } from 'react';
import { gunakanPengeluaran } from '@/hooks/useExpenses';
import { gunakanProfil } from '@/hooks/useProfile';
import { gunakanPenasihat } from '@/hooks/useAdvisor';
import { HasilPenasihat } from '@/components/advisor/AdvisorResult';
import { ObrolanPenasihat } from '@/components/advisor/AdvisorChat';
import { Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export const HalamanPenasihat: React.FC = () => {
  const { daftarPengeluaran, sedangMemuat: sedangMemuatPengeluaran } = gunakanPengeluaran();
  const { profil, sedangMemuat: sedangMemuatProfil } = gunakanProfil();
  const {
    analisis,
    riwayatObrolan,
    sedangMemuat: sedangMemuatPenasihat,
    sedangMemuatObrolan,
    mulaiAnalisis,
    kirimPesanLanjutan,
  } = gunakanPenasihat(profil);

  // Periksa pengeluaran bulan saat ini
  const pengeluaranBulanSekarang = useMemo(() => {
    const sekarang = new Date();
    const tahunSekarang = sekarang.getFullYear();
    const bulanSekarang = sekarang.getMonth();
    return daftarPengeluaran.filter((exp) => {
      const bagian = exp.tanggal.split('-');
      if (bagian.length !== 3) return false;
      const tahun = parseInt(bagian[0], 10);
      const bulan = parseInt(bagian[1], 10) - 1; // Indeks dimulai dari 0
      return tahun === tahunSekarang && bulan === bulanSekarang;
    });
  }, [daftarPengeluaran]);

  const apakahAdaPengeluaranBulanIni = pengeluaranBulanSekarang.length > 0;

  const tanganiMulaiAnalisis = () => {
    mulaiAnalisis(daftarPengeluaran);
  };

  const tanganiKirimPesan = async (msg: string) => {
    await kirimPesanLanjutan(daftarPengeluaran, msg);
  };

  if (sedangMemuatPengeluaran || sedangMemuatProfil) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-text-secondary">Memuat data transaksi dan AI Advisor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Pengantar */}
      <div className="flex flex-col gap-1 pb-2 border-b border-border/20 select-none">
        <div className="flex items-center gap-2 text-text-primary">
          <Sparkles className="w-5 h-5 text-primary shrink-0" />
          <h2 className="text-xl font-bold">AI Financial Advisor</h2>
        </div>
        <p className="text-xs text-text-secondary">Dapatkan rekomendasi keuangan personal dan analisis otomatis berbasis pola belanjamu.</p>
      </div>

      {sedangMemuatPenasihat ? (
        /* State loading saat analisis berlangsung */
        <div className="bg-surface border border-border rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px] shadow-xl select-none animate-pulse">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary animate-bounce mb-4">
            <Sparkles className="w-10 h-10" />
          </div>
          <h3 className="font-bold text-lg text-text-primary mb-2">Smart Spending AI sedang menganalisis...</h3>
          <p className="text-sm text-text-secondary max-w-md leading-relaxed">
            AI sedang membaca data transaksi bulan ini, menghitung pola pengeluaran, dan merumuskan 3 saran konkret terbaik untuk finansialmu.
          </p>
          <div className="flex items-center gap-1.5 mt-6">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      ) : !analisis ? (
        /* Halaman Selamat Datang / CTA (Analisis belum dimulai) */
        <div className="bg-surface border border-border rounded-2xl p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[350px] shadow-xl relative overflow-hidden select-none">
          {/* Efek glow cahaya */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/5 blur-[80px] pointer-events-none"></div>

          <div className="p-4.5 bg-primary/10 border border-primary/20 rounded-2xl text-primary mb-5 relative">
            <Sparkles className="w-12 h-12" />
          </div>

          <h3 className="font-bold text-xl text-text-primary mb-3">Analisis Finansial Instan</h3>
          <p className="text-sm text-text-secondary max-w-md mb-8 leading-relaxed">
            Temukan apakah pengeluaranmu bulan ini masuk kategori <span className="text-success font-semibold">hemat</span>, <span className="text-info font-semibold">normal</span>, atau <span className="text-danger font-semibold">boros</span> beserta saran konkret penghematan.
          </p>

          {!apakahAdaPengeluaranBulanIni ? (
            /* Peringatan jika tidak ada pengeluaran */
            <div className="p-4 bg-danger/10 border border-danger/25 text-danger text-xs font-semibold rounded-xl flex items-center gap-2 max-w-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Belum ada transaksi di bulan ini. Silakan catat transaksi pengeluaranmu terlebih dahulu.</span>
            </div>
          ) : (
            /* Tombol aksi untuk menganalisis */
            <button
              onClick={tanganiMulaiAnalisis}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-xl shadow-primary/25 active:scale-[0.97]"
            >
              <span>Mulai Analisis Keuanganku</span>
              <Sparkles className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      ) : (
        /* Tampilkan Laporan Analisis & Kotak Percakapan */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Panel kiri: Hasil analisis statis */}
          <div className="md:col-span-7">
            <HasilPenasihat
              hasil={analisis}
              padaPenyegaran={tanganiMulaiAnalisis}
              sedangMemuat={sedangMemuatPenasihat}
            />
          </div>

          {/* Panel kanan: Antarmuka chat */}
          <div className="md:col-span-5">
            <ObrolanPenasihat
              riwayat={riwayatObrolan}
              padaKirimPesan={tanganiKirimPesan}
              sedangMemuat={sedangMemuatObrolan}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default HalamanPenasihat;
