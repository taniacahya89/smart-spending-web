import React from 'react';
import { Pengeluaran } from '@/types';
import { PETA_KATEGORI } from '@/constants/categories';
import { formatRupiah, formatTanggal } from '@/lib/formatters';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';

interface AlatItemPengeluaran {
  pengeluaran: Pengeluaran;
  padaUbah: (pengeluaran: Pengeluaran) => void;
  padaHapus: (id: string) => void;
  apakahSedangMenghapus: boolean;
}

export const ItemPengeluaran: React.FC<AlatItemPengeluaran> = ({
  pengeluaran,
  padaUbah,
  padaHapus,
  apakahSedangMenghapus,
}) => {
  const infoKategori = PETA_KATEGORI[pengeluaran.kategori] || PETA_KATEGORI['Lainnya'];
  
  // Dapatkan Ikon Lucide secara dinamis
  const KomponenIkon = (Icons as any)[infoKategori.ikon] || Icons.HelpCircle;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface border border-border rounded-xl transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-background/50 select-none">
      <div className="flex items-start gap-4">
        {/* Pembungkus Ikon Kategori */}
        <div className={`p-3 rounded-xl border ${infoKategori.kelasBg} ${infoKategori.kelasBingkai} ${infoKategori.kelasTeks} shrink-0`}>
          <KomponenIkon className="w-5 h-5" />
        </div>

        {/* Detail Konten */}
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${infoKategori.kelasBg} ${infoKategori.kelasTeks} ${infoKategori.kelasBingkai}`}>
              {pengeluaran.kategori}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-text-secondary">
              <Calendar className="w-3 h-3" />
              <span>{formatTanggal(pengeluaran.tanggal)}</span>
            </span>
          </div>

          <p className="text-sm font-semibold text-text-primary truncate">
            {pengeluaran.deskripsi || <span className="text-text-secondary italic">Tanpa deskripsi</span>}
          </p>
        </div>
      </div>

      {/* Area Nominal & Tombol Aksi */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 mt-4 sm:mt-0 pt-3 sm:pt-0 border-t border-border/40 sm:border-t-0">
        <span className="text-base font-bold text-text-primary tabular-nums">
          {formatRupiah(pengeluaran.nominal)}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => padaUbah(pengeluaran)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background border border-transparent hover:border-border transition-all active:scale-[0.97]"
            title="Edit Pengeluaran"
          >
            <Pencil className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => padaHapus(pengeluaran.id)}
            className="p-2 rounded-lg text-danger/80 hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/10 transition-all active:scale-[0.97] flex items-center justify-center"
            title="Hapus Pengeluaran"
            disabled={apakahSedangMenghapus}
          >
            {apakahSedangMenghapus ? (
              <span className="w-4 h-4 border-2 border-danger border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
