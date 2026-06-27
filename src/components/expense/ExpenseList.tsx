import React from 'react';
import { Pengeluaran } from '@/types';
import { ItemPengeluaran } from './ExpenseItem';
import { Plus, Receipt } from 'lucide-react';

interface AlatDaftarPengeluaran {
  daftarPengeluaran: Pengeluaran[];
  padaUbah: (pengeluaran: Pengeluaran) => void;
  padaHapus: (id: string) => void;
  idSedangDihapus: string | null;
  sedangMemuat: boolean;
  padaKlikTambah: () => void;
}

export const DaftarPengeluaran: React.FC<AlatDaftarPengeluaran> = ({
  daftarPengeluaran,
  padaUbah,
  padaHapus,
  idSedangDihapus,
  sedangMemuat,
  padaKlikTambah,
}) => {
  
  // Render Loader Shimmer Skeleton
  if (sedangMemuat) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface border border-border rounded-xl animate-pulse">
            <div className="flex items-center gap-4 w-full sm:w-2/3">
              {/* Shimmer icon box */}
              <div className="w-11 h-11 bg-background/50 border border-border/50 rounded-xl shrink-0"></div>
              {/* Shimmer labels */}
              <div className="space-y-2.5 w-full">
                <div className="flex gap-2">
                  <div className="h-4 bg-background/60 rounded-full w-20"></div>
                  <div className="h-4 bg-background/60 rounded-full w-28"></div>
                </div>
                <div className="h-5 bg-background/80 rounded w-1/2"></div>
              </div>
            </div>
            {/* Shimmer price and buttons */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 mt-4 sm:mt-0 pt-3 sm:pt-0 border-t border-border/40 sm:border-t-0 w-full sm:w-1/4">
              <div className="h-6 bg-background/80 rounded w-24"></div>
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-background/50 rounded-lg"></div>
                <div className="w-8 h-8 bg-background/50 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render Status Kosong
  if (daftarPengeluaran.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 md:p-16 bg-surface border border-border rounded-2xl select-none">
        {/* Friendly SVG Illustration */}
        <div className="relative mb-6 text-primary/20">
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" fill="currentColor" fillOpacity="0.1" />
            <rect x="65" y="55" width="70" height="90" rx="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M80 85H120" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M80 105H120" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            <path d="M80 125H105" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            {/* Tiny floating coin */}
            <circle cx="140" cy="65" r="15" fill="#6C63FF" fillOpacity="0.3" stroke="#6C63FF" strokeWidth="2" className="animate-bounce" />
          </svg>
          <Receipt className="w-10 h-10 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>

        <h3 className="text-lg font-bold text-text-primary mb-2">Belum ada pengeluaran nih</h3>
        <p className="text-sm text-text-secondary max-w-sm mb-6 leading-relaxed">
          Yuk mulai catat pengeluaran harianmu sekarang biar kondisi finansialmu terpantau rapi!
        </p>
        
        <button
          onClick={padaKlikTambah}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/15 active:scale-[0.97]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Tambah Pengeluaran</span>
        </button>
      </div>
    );
  }

  // Render List
  return (
    <div className="space-y-3.5">
      {daftarPengeluaran.map((pengeluaranSatuan) => (
        <ItemPengeluaran
          key={pengeluaranSatuan.id}
          pengeluaran={pengeluaranSatuan}
          padaUbah={padaUbah}
          padaHapus={padaHapus}
          apakahSedangMenghapus={idSedangDihapus === pengeluaranSatuan.id}
        />
      ))}
    </div>
  );
};
