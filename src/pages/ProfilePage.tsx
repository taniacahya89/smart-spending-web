import React from 'react';
import { gunakanAutentikasi } from '@/hooks/useAuth';
import { gunakanPengeluaran } from '@/hooks/useExpenses';
import { formatRupiah } from '@/lib/formatters';
import { User, LogOut, Mail, Calendar, Wallet, ListTodo } from 'lucide-react';

export const HalamanProfil: React.FC = () => {
  const { pengguna, keluar } = gunakanAutentikasi();
  const { daftarPengeluaran } = gunakanPengeluaran();

  // Hitung statistik seumur hidup
  const totalPengeluaran = daftarPengeluaran.reduce((jumlah, item) => jumlah + item.nominal, 0);
  const totalTransaksi = daftarPengeluaran.length;
  
  // Dapatkan tanggal saat pengguna terdaftar
  const tanggalTerdaftar = pengguna?.created_at
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(pengguna.created_at))
    : 'Tidak diketahui';

  return (
    <div className="max-w-2xl mx-auto space-y-6 select-none">
      {/* Header Halaman */}
      <div className="flex flex-col gap-1 pb-2 border-b border-border/20">
        <div className="flex items-center gap-2 text-text-primary">
          <User className="w-5 h-5 text-primary shrink-0" />
          <h2 className="text-xl font-bold">Profil Saya</h2>
        </div>
        <p className="text-xs text-text-secondary">Kelola informasi akun dan tinjau performa pencatatanmu.</p>
      </div>

      {/* Info Kartu Profil */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary shrink-0">
            <User className="w-8 h-8" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-text-primary truncate">
              {pengguna?.email?.split('@')[0]}
            </h3>
            <span className="inline-block text-[10px] font-bold text-primary bg-primary/15 border border-primary/25 rounded-full px-2 py-0.5 mt-1">
              PRO MEMBER
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Baris Email */}
          <div className="flex items-center gap-3 p-3 bg-background border border-border/60 rounded-xl">
            <Mail className="w-5 h-5 text-text-secondary shrink-0" />
            <div className="min-w-0">
              <span className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider">Email</span>
              <span className="text-sm font-semibold text-text-primary truncate block">{pengguna?.email}</span>
            </div>
          </div>

          {/* Baris Tanggal Terdaftar */}
          <div className="flex items-center gap-3 p-3 bg-background border border-border/60 rounded-xl">
            <Calendar className="w-5 h-5 text-text-secondary shrink-0" />
            <div>
              <span className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider">Terdaftar Sejak</span>
              <span className="text-sm font-semibold text-text-primary block">{tanggalTerdaftar}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Kartu Statistik Lifetime */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-xl space-y-4">
        <h4 className="text-sm font-bold text-text-primary border-b border-border/40 pb-2.5">
          Performa Lifetime Pencatatan
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-background border border-border/60 rounded-xl">
            <Wallet className="w-6 h-6 text-primary mx-auto mb-2" />
            <span className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider">Total Catatan</span>
            <span className="text-base font-bold text-text-primary mt-1 block tabular-nums">
              {formatRupiah(totalPengeluaran)}
            </span>
          </div>

          <div className="text-center p-4 bg-background border border-border/60 rounded-xl">
            <ListTodo className="w-6 h-6 text-info mx-auto mb-2" />
            <span className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider">Total Transaksi</span>
            <span className="text-base font-bold text-text-primary mt-1 block tabular-nums">
              {totalTransaksi} Item
            </span>
          </div>
        </div>
      </div>

      {/* Kartu Tindakan */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => keluar()}
          className="flex items-center gap-2 px-6 py-3 bg-danger/10 border border-danger/20 hover:bg-danger text-danger hover:text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg active:scale-[0.97]"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Keluar dari Akun</span>
        </button>
      </div>
    </div>
  );
};
export default HalamanProfil;
