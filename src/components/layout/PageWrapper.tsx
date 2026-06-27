import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BilahSisi } from './Sidebar';
import { BilahNavigasi } from './Navbar';
import { LayoutDashboard, ReceiptText, Sparkles, User, Sun, Moon, Settings } from 'lucide-react';

interface AlatPembungkusHalaman {
  children: React.ReactNode;
}

export const PembungkusHalaman: React.FC<AlatPembungkusHalaman> = ({ children }) => {
  const lokasi = useLocation();
  
  // State tema
  const [apakahModeGelap, aturApakahModeGelap] = useState<boolean>(() => {
    const tersimpan = localStorage.getItem('smart_spending_theme');
    return tersimpan ? tersimpan === 'dark' : true; // default adalah dark fintech
  });

  useEffect(() => {
    if (apakahModeGelap) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smart_spending_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smart_spending_theme', 'light');
    }
  }, [apakahModeGelap]);

  const ubahModeGelap = () => {
    aturApakahModeGelap(!apakahModeGelap);
  };

  // Petakan jalur ke judul halaman
  const dapatkanJudulHalaman = (jalurDokumen: string): string => {
    switch (jalurDokumen) {
      case '/':
        return 'Dashboard';
      case '/expenses':
        return 'Pengeluaran';
      case '/advisor':
        return 'Advisor Keuangan';
      case '/profile':
        return 'Profil';
      case '/settings':
        return 'Pengaturan';
      default:
        return 'Smart Spending';
    }
  };

  const judul = dapatkanJudulHalaman(lokasi.pathname);

  return (
    <div className="flex min-h-screen bg-background text-text-primary transition-colors duration-200">
      {/* Sidebar Desktop */}
      <BilahSisi />

      {/* Panel Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Navbar Desktop */}
        <BilahNavigasi judul={judul} apakahModeGelap={apakahModeGelap} ubahModeGelap={ubahModeGelap} />

        {/* Header Seluler */}
        <header className="md:hidden flex h-14 items-center justify-between px-6 bg-surface border-b border-border z-10">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-text-primary">{judul}</span>
            {judul === 'Advisor Keuangan' && (
              <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            )}
          </div>
          <button
            onClick={ubahModeGelap}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-all active:scale-[0.97]"
          >
            {apakahModeGelap ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-primary" />}
          </button>
        </header>

        {/* Konten halaman dinamis dengan transisi memudar */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Navigasi Bawah Seluler */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-center justify-around px-4 z-40">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 h-full text-center transition-all ${
              isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to="/expenses"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 h-full text-center transition-all ${
              isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          <ReceiptText className="w-5 h-5" />
          <span className="text-[10px] font-medium">Expenses</span>
        </NavLink>

        <NavLink
          to="/advisor"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 h-full text-center transition-all ${
              isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-medium">Advisor</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 h-full text-center transition-all ${
              isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Profil</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-1 flex-1 h-full text-center transition-all ${
              isActive ? 'text-primary scale-105' : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};
