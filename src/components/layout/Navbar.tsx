import React from 'react';
import { gunakanAutentikasi } from '@/hooks/useAuth';
import { LogOut, Sun, Moon, Sparkles } from 'lucide-react';

interface AlatBilahNavigasi {
  judul: string;
  apakahModeGelap: boolean;
  ubahModeGelap: () => void;
}

export const BilahNavigasi: React.FC<AlatBilahNavigasi> = ({ judul, apakahModeGelap, ubahModeGelap }) => {
  const { pengguna, keluar } = gunakanAutentikasi();

  return (
    <header className="hidden md:flex h-16 items-center justify-between border-b border-border bg-surface px-8 z-10">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold tracking-tight text-text-primary">{judul}</h1>
        {judul === 'Advisor' && (
          <span className="flex items-center gap-1 text-[10px] font-semibold bg-primary/20 text-primary border border-primary/30 rounded-full px-2 py-0.5 animate-pulse">
            <Sparkles className="w-3 h-3" /> AI AKTIF
          </span>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Tombol Ganti Tema */}
        <button
          onClick={ubahModeGelap}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-all active:scale-[0.97]"
          title="Ganti Tema"
        >
          {apakahModeGelap ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-primary" />}
        </button>

        {/* Informasi Profil Pengguna & Keluar */}
        {pengguna && (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-text-primary truncate max-w-[150px]">
                {pengguna.email?.split('@')[0]}
              </span>
              <span className="text-[10px] text-text-secondary">Pengguna Smart Spending</span>
            </div>

            <div className="h-8 w-px bg-border"></div>

            <button
              onClick={() => keluar()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all active:scale-[0.97]"
              title="Keluar dari akun"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
