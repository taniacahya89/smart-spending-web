import React, { useState } from 'react';
import { gunakanPengeluaran } from '@/hooks/useExpenses';
import { gunakanProfil } from '@/hooks/useProfile';
import { gunakanStatistikDasbor } from '@/hooks/useDashboardStats';
import { KartuRingkasan } from '@/components/dashboard/SummaryCard';
import { GrafikPengeluaran } from '@/components/dashboard/SpendingChart';
import { RincianKategori } from '@/components/dashboard/CategoryBreakdown';
import { KemajuanAnggaran } from '@/components/dashboard/BudgetProgress';
import { FormulirPengeluaran } from '@/components/expense/ExpenseForm';
import { formatRupiah } from '@/lib/formatters';
import { TrendingDown, Hash, Award, Plus, Sparkles, AlertCircle, X, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HalamanDasbor: React.FC = () => {
  const { daftarPengeluaran, sedangMemuat: sedangMemuatPengeluaran, sedangMenyimpan, tambahPengeluaran } = gunakanPengeluaran();
  const { profil, sedangMemuat: sedangMemuatProfil } = gunakanProfil();
  const statistik = gunakanStatistikDasbor(daftarPengeluaran);
  const [apakahTambahTerbuka, aturApakahTambahTerbuka] = useState(false);

  const pendapatanBulanan = profil?.pendapatanBulanan || 0;
  const sisaAnggaran = pendapatanBulanan - statistik.totalBulanIni;
  const sedangMemuat = sedangMemuatPengeluaran || sedangMemuatProfil;

  // Label bulan dalam Bahasa Indonesia
  const labelBulanSekarang = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const tanganiTambahCepat = async (data: any) => {
    const pengeluaranBaru = await tambahPengeluaran(data);
    if (pengeluaranBaru) {
      aturApakahTambahTerbuka(false);
      return true;
    }
    return false;
  };

  const namaPengguna = profil?.nama || 'User';

  return (
    <div className="space-y-6">
      {/* Banner peringatan jika pendapatan bulanan adalah 0 */}
      {!sedangMemuat && pendapatanBulanan === 0 && (
        <div className="p-4 bg-[#FBBF24]/10 border border-[#FBBF24]/20 rounded-xl text-[#FBBF24] flex items-center justify-between gap-3 animate-fade-in select-none">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">
              Pendapatan bulanan belum diatur! Set pendapatan Anda di Pengaturan untuk mengaktifkan pelacakan anggaran AI.
            </p>
          </div>
          <Link
            to="/settings"
            className="text-xs font-bold underline hover:text-[#FBBF24]/85 shrink-0"
          >
            Atur Sekarang
          </Link>
        </div>
      )}

      {/* Header selamat datang & tombol pintasan cepat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-2 border-b border-border/20">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-semibold text-text-primary">{namaPengguna}</h2>
          <span className="text-text-secondary text-sm font-medium">{labelBulanSekarang}</span>
        </div>
        
        <button
          onClick={() => aturApakahTambahTerbuka(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.97]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Tambah Pengeluaran</span>
        </button>
      </div>

      {/* Grid Kartu Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sedangMemuat ? (
          // Shimmer cards
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 min-h-[140px] animate-pulse flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-2 w-2/3">
                  <div className="h-4 bg-background/50 rounded w-16"></div>
                  <div className="h-6 bg-background/80 rounded w-28"></div>
                </div>
                <div className="w-10 h-10 bg-background/50 rounded-xl"></div>
              </div>
              <div className="h-4 bg-background/50 rounded w-32 mt-4"></div>
            </div>
          ))
        ) : (
          <>
            {/* 1. Total Pengeluaran */}
            <KartuRingkasan
              judul="Total Pengeluaran"
              nilai={formatRupiah(statistik.totalBulanIni)}
              subjudul={`Periode ${labelBulanSekarang}`}
              ikon={<TrendingDown className="w-4 h-4" />}
            />

            {/* 2. Jumlah Transaksi */}
            <KartuRingkasan
              judul="Jumlah Transaksi"
              nilai={`${statistik.jumlahTransaksi} Transaksi`}
              subjudul="Telah dicatat bulan ini"
              ikon={<Hash className="w-4 h-4" />}
            />

            {/* 3. Kategori Terbesar */}
            <KartuRingkasan
              judul="Kategori Terbesar"
              nilai={statistik.kategoriTerbesar || 'Belum Ada'}
              subjudul="Porsi belanja tertinggi"
              ikon={<Award className="w-4 h-4" />}
            />

            {/* 4. Sisa Budget */}
            <KartuRingkasan
              judul="Sisa Budget"
              nilai={formatRupiah(sisaAnggaran)}
              subjudul={pendapatanBulanan > 0 ? `Dari pendapatan bulan ini` : `Pendapatan belum diset`}
              ikon={<Wallet className="w-4 h-4" />}
            />
          </>
        )}
      </div>

      {/* Komponen Progres Anggaran */}
      {!sedangMemuat && (
        <KemajuanAnggaran pendapatanBulanan={pendapatanBulanan} totalPengeluaran={statistik.totalBulanIni} />
      )}

      {/* Grid Grafik Statistik Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sedangMemuat ? (
          // Shimmer charts
          [1, 2].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 h-[320px] animate-pulse flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-background/60 rounded w-32"></div>
                <div className="h-4 bg-background/60 rounded w-48"></div>
              </div>
              <div className="flex-1 bg-background/40 rounded-xl mt-4 w-full"></div>
            </div>
          ))
        ) : (
          <>
            {/* Grafik tren pengeluaran harian */}
            <GrafikPengeluaran data={statistik.pengeluaranHarian} />

            {/* Diagram rincian kategori */}
            <RincianKategori data={statistik.rincianKategori} />
          </>
        )}
      </div>

      {/* Kotak Promosi AI Advisor */}
      <div className="bg-surface border border-border rounded-2xl p-6 select-none flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        {/* Desain Glow */}
        <div className="absolute right-[-100px] top-[-50px] w-[300px] h-[300px] rounded-full bg-primary/10 blur-[60px] pointer-events-none"></div>
        
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary/15 border border-primary/20 rounded-2xl text-primary shrink-0 animate-bounce">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-text-primary">Punya Pertanyaan Finansial?</h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-md">
              Kondisi pengeluaranmu bulan ini sudah terpantau. Ingin tahu tips menghemat makanan, belanja pintar, atau analisis kebiasaan belanjamu dari AI Advisor?
            </p>
          </div>
        </div>

        <Link
          to="/advisor"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.97] shrink-0"
        >
          <span>Tanya AI Advisor</span>
          <Sparkles className="w-4 h-4" />
        </Link>
      </div>

      {/* Dialog Modal untuk Tambah Cepat Pengeluaran */}
      {apakahTambahTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/40 mb-4 select-none">
              <h3 className="font-bold text-base text-text-primary">Tambah Pengeluaran Baru</h3>
              <button
                onClick={() => aturApakahTambahTerbuka(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-all active:scale-[0.97]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FormulirPengeluaran
              padaKirim={tanganiTambahCepat}
              padaBatal={() => aturApakahTambahTerbuka(false)}
              sedangMenyimpan={sedangMenyimpan}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default HalamanDasbor;
