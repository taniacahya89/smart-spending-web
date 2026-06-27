import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PenyediaAutentikasi } from '@/context/AuthContext';
import { PenyediaPesan } from '@/context/ToastContext';
import { gunakanAutentikasi } from '@/hooks/useAuth';
import { HalamanMasuk } from '@/pages/LoginPage';
import { HalamanDaftar } from '@/pages/RegisterPage';
import { HalamanDasbor } from '@/pages/DashboardPage';
import { HalamanCatatanPengeluaran } from '@/pages/ExpensesPage';
import { HalamanPenasihat } from '@/pages/AdvisorPage';
import { HalamanProfil } from '@/pages/ProfilePage';
import { HalamanPengaturan } from '@/pages/SettingsPage';
import { PembungkusHalaman } from '@/components/layout/PageWrapper';
import { Loader2 } from 'lucide-react';

// Pembungkus untuk Rute Dilindungi (Mengalihkan pengguna yang tidak terautentikasi ke halaman masuk)
const RuteDilindungi: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pengguna, sedangMemuat } = gunakanAutentikasi();

  if (sedangMemuat) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center select-none">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <span className="text-sm text-text-secondary font-medium">Mengecek sesi masuk...</span>
      </div>
    );
  }

  if (!pengguna) {
    return <Navigate to="/login" replace />;
  }

  return <PembungkusHalaman>{children}</PembungkusHalaman>;
};

export const App: React.FC = () => {
  return (
    <PenyediaPesan>
      <PenyediaAutentikasi>
        <BrowserRouter>
          <Routes>
            {/* Rute Autentikasi Publik */}
            <Route path="/login" element={<HalamanMasuk />} />
            <Route path="/register" element={<HalamanDaftar />} />

            {/* Rute Aplikasi yang Dilindungi */}
            <Route
              path="/"
              element={
                <RuteDilindungi>
                  <HalamanDasbor />
                </RuteDilindungi>
              }
            />
            <Route
              path="/expenses"
              element={
                <RuteDilindungi>
                  <HalamanCatatanPengeluaran />
                </RuteDilindungi>
              }
            />
            <Route
              path="/advisor"
              element={
                <RuteDilindungi>
                  <HalamanPenasihat />
                </RuteDilindungi>
              }
            />
            <Route
              path="/profile"
              element={
                <RuteDilindungi>
                  <HalamanProfil />
                </RuteDilindungi>
              }
            />
            <Route
              path="/settings"
              element={
                <RuteDilindungi>
                  <HalamanPengaturan />
                </RuteDilindungi>
              }
            />

            {/* Pengalihan Rute Tidak Valid */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PenyediaAutentikasi>
    </PenyediaPesan>
  );
};
export default App;
