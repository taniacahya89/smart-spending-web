import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { gunakanAutentikasi } from '@/hooks/useAuth';
import { gunakanPesan } from '@/context/ToastContext';
import { Wallet, Mail, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export const HalamanDaftar: React.FC = () => {
  const { pengguna } = gunakanAutentikasi();
  const { tampilkanPesan } = gunakanPesan();
  const navigate = useNavigate();

  const [surel, aturSurel] = useState('');
  const [kataSandi, aturKataSandi] = useState('');
  const [konfirmasiKataSandi, aturKonfirmasiKataSandi] = useState('');
  const [sedangMemuat, aturSedangMemuat] = useState(false);
  const [pesanKesalahan, aturPesanKesalahan] = useState<string | null>(null);
  const [statusSukses, aturStatusSukses] = useState(false);

  // Jika pengguna sudah login, arahkan ke dasbor
  useEffect(() => {
    if (pengguna) {
      navigate('/');
    }
  }, [pengguna, navigate]);

  const tanganiDaftar = async (e: React.FormEvent) => {
    e.preventDefault();
    aturPesanKesalahan(null);

    const surelBersih = surel ? surel.trim() : '';
    const kataSandiBersih = kataSandi ? kataSandi.trim() : '';
    const konfirmasiKataSandiBersih = konfirmasiKataSandi ? konfirmasiKataSandi.trim() : '';

    // Validasi Formulir
    if (!surelBersih || !kataSandiBersih || !konfirmasiKataSandiBersih) {
      aturPesanKesalahan('Semua field wajib diisi');
      return;
    }

    if (kataSandiBersih.length < 6) {
      aturPesanKesalahan('Kata sandi minimal berisi 6 karakter');
      return;
    }

    if (kataSandiBersih !== konfirmasiKataSandiBersih) {
      aturPesanKesalahan('Konfirmasi kata sandi tidak cocok');
      return;
    }

    aturSedangMemuat(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: surelBersih,
        password: kataSandiBersih,
      });

      if (error) throw error;

      // periksa apakah sesi langsung dimulai (jika konfirmasi email mati di Supabase)
      if (data?.session) {
        tampilkanPesan('Pendaftaran berhasil! Selamat datang di Smart Spending.', 'success');
        navigate('/');
      } else {
        aturStatusSukses(true);
        tampilkanPesan('Pendaftaran berhasil! Cek email verifikasi.', 'success');
      }
    } catch (err: any) {
      console.error('Error signing up:', err);
      aturPesanKesalahan(err.message || 'Gagal mendaftarkan akun. Silakan coba lagi.');
    } finally {
      aturSedangMemuat(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 select-none">
      {/* Container Card */}
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary p-3 rounded-2xl text-text-primary shadow-lg shadow-primary/25 mb-4">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">Daftar Smart Spending</h2>
          <p className="text-sm text-text-secondary mt-1 max-w-xs">
            Mulai atur dan sadari kemana perginya uang jajanmu hari ini
          </p>
        </div>

        {statusSukses ? (
          /* Layar Sukses */
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-success/10 border border-success/20 rounded-2xl text-success flex flex-col items-center gap-3 text-center">
              <CheckCircle2 className="w-12 h-12" />
              <h3 className="font-bold text-base text-text-primary">Registrasi Hampir Selesai!</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Kami telah mengirimkan email verifikasi ke <strong className="text-text-primary">{surel}</strong>.<br />
                Silakan buka kotak masuk email kamu dan klik link konfirmasi untuk mulai menggunakan Smart Spending.
              </p>
            </div>
            <Link
              to="/login"
              className="w-full block text-center py-2.5 bg-background border border-border hover:border-primary text-text-primary text-sm font-semibold rounded-xl transition-all active:scale-[0.98]"
            >
              Kembali ke Halaman Masuk
            </Link>
          </div>
        ) : (
          /* Formulir Pendaftaran */
          <>
            {pesanKesalahan && (
              <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold leading-relaxed">{pesanKesalahan}</p>
              </div>
            )}

            <form onSubmit={tanganiDaftar} className="space-y-4">
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
                  Kata Sandi (Min. 6 Karakter)
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

              {/* Input Konfirmasi Password */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <input
                    type="password"
                    value={konfirmasiKataSandi}
                    onChange={(e) => aturKonfirmasiKataSandi(e.target.value)}
                    placeholder="Ulangi kata sandi..."
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
                    <span>Mendaftarkan Akun...</span>
                  </>
                ) : (
                  <span>Daftar Akun Baru</span>
                )}
              </button>
            </form>

            {/* Catatan Kaki */}
            <div className="text-center pt-2">
              <p className="text-xs text-text-secondary">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary hover:underline font-bold">
                  Masuk Sini
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default HalamanDaftar;
