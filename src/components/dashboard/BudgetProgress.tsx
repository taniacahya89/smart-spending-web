import React from 'react';
import { Link } from 'react-router-dom';
import { formatRupiah } from '@/lib/formatters';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface AlatKemajuanAnggaran {
  pendapatanBulanan: number;
  totalPengeluaran: number;
}

export const KemajuanAnggaran: React.FC<AlatKemajuanAnggaran> = ({
  pendapatanBulanan,
  totalPengeluaran,
}) => {
  if (pendapatanBulanan <= 0) {
    return (
      <div className="bg-surface border border-border/80 rounded-2xl p-5 select-none flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-info/10 border border-info/20 rounded-xl text-info">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-text-primary">Status Anggaran Belum Aktif</h4>
            <p className="text-xs text-text-secondary mt-0.5">Set pendapatan di Settings untuk melihat budget status.</p>
          </div>
        </div>
        <Link
          to="/settings"
          className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline hover:translate-x-0.5 transition-all shrink-0"
        >
          <span>Set Pendapatan Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const rasio = pendapatanBulanan > 0 ? Math.round((totalPengeluaran / pendapatanBulanan) * 100) : 0;
  const rasioMaksimal = Math.min(rasio, 100);

  // Warna dinamis: hijau (#22C55E) jika < 50%, kuning (#FBBF24) jika 50-80%, merah (#F43F5E) jika > 80%
  let warnaProgres = 'bg-[#22C55E]';
  let warnaTeks = 'text-[#22C55E]';

  if (rasio >= 50 && rasio <= 80) {
    warnaProgres = 'bg-[#FBBF24]';
    warnaTeks = 'text-[#FBBF24]';
  } else if (rasio > 80) {
    warnaProgres = 'bg-[#F43F5E]';
    warnaTeks = 'text-[#F43F5E]';
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-xl select-none space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h4 className="text-sm font-bold text-text-primary">Progres Anggaran Bulanan</h4>
          <p className="text-xs text-text-secondary mt-0.5">Persentase pengeluaran terhadap pendapatan.</p>
        </div>
        <span className={`text-sm font-bold ${warnaTeks}`}>
          {formatRupiah(totalPengeluaran)} dari {formatRupiah(pendapatanBulanan)} ({rasio}%)
        </span>
      </div>

      {/* Progres Bar Anggaran */}
      <div className="h-2.5 w-full bg-background border border-border rounded-full overflow-hidden">
        <div
          className={`h-full ${warnaProgres} transition-all duration-500 rounded-full`}
          style={{ width: `${rasioMaksimal}%` }}
        ></div>
      </div>
    </div>
  );
};
