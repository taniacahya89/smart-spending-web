import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface AlatDialogKonfirmasi {
  apakahTerbuka: boolean;
  judul: string;
  pesan: string;
  labelKonfirmasi?: string;
  labelBatal?: string;
  padaKonfirmasi: () => void;
  padaBatal: () => void;
  apakahSedangKonfirmasi?: boolean;
}

export const DialogKonfirmasi: React.FC<AlatDialogKonfirmasi> = ({
  apakahTerbuka,
  judul,
  pesan,
  labelKonfirmasi = 'Hapus',
  labelBatal = 'Batal',
  padaKonfirmasi,
  padaBatal,
  apakahSedangKonfirmasi = false,
}) => {
  if (!apakahTerbuka) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm select-none animate-fade-in">
      {/* Panel Kartu Modal */}
      <div 
        className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          {/* Pembungkus Ikon Peringatan */}
          <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="min-w-0">
            <h4 className="text-base font-bold text-text-primary leading-snug">
              {judul}
            </h4>
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">
              {pesan}
            </p>
          </div>
        </div>

        {/* Area Tombol */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-border/20">
          <button
            type="button"
            onClick={padaBatal}
            className="px-4 py-2 text-sm font-semibold border border-border rounded-lg text-text-primary hover:bg-background transition-all active:scale-[0.97]"
            disabled={apakahSedangKonfirmasi}
          >
            {labelBatal}
          </button>
          
          <button
            type="button"
            onClick={padaKonfirmasi}
            className="flex items-center gap-1.5 px-4.5 py-2 text-sm font-semibold bg-danger hover:bg-rose-600 text-text-primary rounded-lg transition-all shadow-lg shadow-danger/15 active:scale-[0.97]"
            disabled={apakahSedangKonfirmasi}
          >
            {apakahSedangKonfirmasi ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>{labelKonfirmasi}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
