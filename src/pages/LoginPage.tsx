import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { gunakanAutentikasi } from '@/hooks/useAuth';
import { gunakanPesan } from '@/context/ToastContext';
import { Wallet, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export const HalamanMasuk: React.FC = () => {
  const { pengguna } = gunakanAutentikasi();
  const { tampilkanPesan } = gunakanPesan();
  const navigate = useNavigate();

  const [surel, aturSurel] = useState('');
  const [kataSandi, aturKataSandi] = useState('');
  const [sedangMemuat, aturSedangMemuat] = useState(false);
  const [pesanKesalahan, aturPesanKesalahan] = useState<string | null>(null);

  // Jika pengguna sudah masuk, arahkan ke dasbor
  useEffect(() => {
    if (pengguna) {
      navigate('/');
    }
  }, [pengguna, navigate]);

  const tanganiMasuk = async (e: React.FormEvent) => {
    e.preventDefault();
    aturPesanKesalahan(null);

    const surelBersih = surel ? surel.trim() : '';
    const kataSandiBersih = kataSandi ? kataSandi.trim() : '';

    // Validasi sederhana
    if (!surelBersih || !kataSandiBersih) {
      aturPesanKesalahan('Email dan password wajib diisi');
      return;
    }

    aturSedangMemuat(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: surelBersih,
        password: kataSandiBersih,
      });

      if (error) throw error;

      tampilkanPesan('Login berhasil! Selamat datang kembali.', 'success');
      navigate('/');
    } catch (err: any) {
      console.error('Error logging in:', err);
      aturPesanKesalahan(err.message || 'Email atau password salah');
    } finally {
      aturSedangMemuat(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 select-none">
      {/* Container Card */}
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary p-3 rounded-2xl text-text-primary shadow-lg shadow-primary/25 mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Masuk ke Smart Spending</h2>
          <p className="text-sm text-text-secondary mt-1 max-w-xs">
            Catat pengeluaran harianmu dengan rekomendasi finansial bertenaga AI
          </p>
        </div>

        {/* Peringatan Kesalahan */}
        {pesanKesalahan && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold leading-relaxed">{pesanKesalahan}</p>
          </div>
        )}

        {/* Formulir Masuk */}
        <form onSubmit={tanganiMasuk} className="space-y-4">
          {/* Input Email */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <input
                type="email"
                value={surel}
                onChange={(e) => aturSurel(e.target.value)}
                placeholder="nama@mahasiswa.id"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                <Lock className="w-4.5 h-4.5" />
              </div>
              <input
                type="password"
                value={kataSandi}
                onChange={(e) => aturKataSandi(e.target.value)}
                placeholder="Masukkan kata sandi..."
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                required
              />
            </div>
          </div>

          {/* Tombol Submit */}
          <button
            type="submit"
            disabled={sedangMemuat}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-[0.98] disabled:bg-primary/50"
          >
            {sedangMemuat ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk Sekarang</span>
            )}
          </button>
        </form>

        {/* Catatan Kaki */}
        <div className="text-center pt-2">
          <p className="text-xs text-text-secondary">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary hover:underline font-bold">
              Daftar Baru
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default HalamanMasuk;
