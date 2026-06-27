import React, { useState, useEffect } from 'react';
import { gunakanProfil } from '@/hooks/useProfile';
import { User, Loader2, Sparkles, AlertCircle, Settings } from 'lucide-react';

export const HalamanPengaturan: React.FC = () => {
  const { profil, sedangMemuat, sedangMenyimpan, kesalahan: kesalahanAmbil, perbaruiProfil } = gunakanProfil();

  const [nama, aturNama] = useState('');
  const [masukanPendapatan, aturMasukanPendapatan] = useState('');
  const [nilaiPendapatan, aturNilaiPendapatan] = useState(0);
  const [daftarKesalahan, aturDaftarKesalahan] = useState<{ nama?: string; pendapatan?: string }>({});

  useEffect(() => {
    if (profil) {
      aturNama(profil.nama || '');
      aturNilaiPendapatan(profil.pendapatanBulanan);
      aturMasukanPendapatan(profil.pendapatanBulanan > 0 ? profil.pendapatanBulanan.toLocaleString('id-ID') : '');
    }
  }, [profil]);

  const tanganiPerubahanPendapatan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nilaiMentah = e.target.value.replace(/[^\d]/g, '');
    const nilaiNumerik = nilaiMentah ? parseInt(nilaiMentah, 10) : 0;
    aturNilaiPendapatan(nilaiNumerik);
    aturMasukanPendapatan(nilaiNumerik > 0 ? nilaiNumerik.toLocaleString('id-ID') : '');
    if (daftarKesalahan.pendapatan) {
      aturDaftarKesalahan((sebelumnya) => ({ ...sebelumnya, pendapatan: undefined }));
    }
  };

  const tanganiPerubahanNama = (e: React.ChangeEvent<HTMLInputElement>) => {
    aturNama(e.target.value);
    if (daftarKesalahan.nama) {
      aturDaftarKesalahan((sebelumnya) => ({ ...sebelumnya, nama: undefined }));
    }
  };

  const tanganiSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    const kesalahanBaru: { nama?: string; pendapatan?: string } = {};

    const namaBersih = nama ? nama.trim() : '';

    if (!namaBersih) {
      kesalahanBaru.nama = 'Nama lengkap wajib diisi';
    }

    if (nilaiPendapatan <= 0) {
      kesalahanBaru.pendapatan = 'Pendapatan bulanan harus lebih besar dari Rp 0';
    }

    if (Object.keys(kesalahanBaru).length > 0) {
      aturDaftarKesalahan(kesalahanBaru);
      return;
    }

    await perbaruiProfil({
      nama: namaBersih,
      pendapatanBulanan: nilaiPendapatan,
    });
  };

  if (sedangMemuat) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm text-text-secondary">Memuat pengaturan profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 select-none animate-fade-in">
      {/* Header Halaman */}
      <div className="flex flex-col gap-1 pb-2 border-b border-border/20">
        <div className="flex items-center gap-2 text-text-primary">
          <Settings className="w-5 h-5 text-primary shrink-0" />
          <h2 className="text-xl font-bold">Pengaturan Profil & Budget</h2>
        </div>
        <p className="text-xs text-text-secondary">Sesuaikan nama dan pendapatan bulanan Anda untuk analisis AI yang akurat.</p>
      </div>

      {kesalahanAmbil && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold leading-relaxed">{kesalahanAmbil}</p>
        </div>
      )}

      {/* Formulir Pengaturan */}
      <form onSubmit={tanganiSimpan} className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Kolom Nama */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Nama Lengkap
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={nama}
              onChange={tanganiPerubahanNama}
              placeholder="Masukkan nama Anda..."
              className={`w-full bg-background border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                daftarKesalahan.nama ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
              }`}
              disabled={sedangMenyimpan}
            />
          </div>
          {daftarKesalahan.nama && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{daftarKesalahan.nama}</span>
            </p>
          )}
        </div>

        {/* Kolom Pendapatan Bulanan */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Pendapatan Bulanan
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
              <span className="text-sm font-semibold">Rp</span>
            </div>
            <input
              type="text"
              value={masukanPendapatan}
              onChange={tanganiPerubahanPendapatan}
              placeholder="0"
              className={`w-full bg-background border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
                daftarKesalahan.pendapatan ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
              }`}
              disabled={sedangMenyimpan}
            />
          </div>
          {daftarKesalahan.pendapatan && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{daftarKesalahan.pendapatan}</span>
            </p>
          )}
        </div>

        {/* Banner Info */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5 animate-pulse" />
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Pendapatan kamu dipakai AI untuk menilai apakah pengeluaranmu hemat atau boros.
          </p>
        </div>

        {/* Tombol Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={sedangMenyimpan}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.97] disabled:bg-primary/50"
          >
            {sedangMenyimpan ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>Simpan Perubahan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default HalamanPengaturan;
