import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Pengeluaran, DataFormulirPengeluaran } from '@/types';
import { gunakanAutentikasi } from '@/hooks/useAuth';
import { gunakanPesan } from '@/context/ToastContext';

export const gunakanPengeluaran = () => {
  const { pengguna } = gunakanAutentikasi();
  const { tampilkanPesan } = gunakanPesan();
  const [daftarPengeluaran, aturDaftarPengeluaran] = useState<Pengeluaran[]>([]);
  const [sedangMemuat, aturSedangMemuat] = useState<boolean>(false);
  const [sedangMenyimpan, aturSedangMenyimpan] = useState<boolean>(false);
  const [idSedangDihapus, aturIdSedangDihapus] = useState<string | null>(null);
  const [kesalahan, aturKesalahan] = useState<string | null>(null);

  const ambilPengeluaran = useCallback(async () => {
    if (!pengguna) return;
    aturSedangMemuat(true);
    aturKesalahan(null);
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', pengguna.id) // Scoping query ke pengguna yang login (Keamanan RLS)
        .order('date', { ascending: false });

      if (error) throw error;

      const daftarPengeluaranDitemukan: Pengeluaran[] = (data || []).map((item: any) => ({
        id: item.id,
        idPengguna: item.user_id,
        nominal: Number(item.amount),
        kategori: item.category,
        deskripsi: item.description,
        tanggal: item.date,
        dibuatPada: item.created_at,
        diperbaruiPada: item.updated_at,
      }));

      aturDaftarPengeluaran(daftarPengeluaranDitemukan);
    } catch (err: any) {
      console.error('Error fetching expenses:', err);
      aturKesalahan(err.message || 'Gagal mengambil data pengeluaran');
      tampilkanPesan('Gagal memuat data pengeluaran', 'danger');
    } finally {
      aturSedangMemuat(false);
    }
  }, [pengguna, tampilkanPesan]);

  const tambahPengeluaran = async (dataFormulir: DataFormulirPengeluaran) => {
    if (!pengguna) return null;
    aturSedangMenyimpan(true);
    aturKesalahan(null);
    try {
      const deskripsiBersih = dataFormulir.deskripsi ? dataFormulir.deskripsi.trim() : null;
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            user_id: pengguna.id,
            amount: dataFormulir.nominal,
            category: dataFormulir.kategori,
            description: deskripsiBersih || null,
            date: dataFormulir.tanggal,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const pengeluaranBaru: Pengeluaran = {
        id: data.id,
        idPengguna: data.user_id,
        nominal: Number(data.amount),
        kategori: data.category,
        deskripsi: data.description,
        tanggal: data.date,
        dibuatPada: data.created_at,
        diperbaruiPada: data.updated_at,
      };

      aturDaftarPengeluaran((sebelumnya) => [pengeluaranBaru, ...sebelumnya]);
      tampilkanPesan('Pengeluaran berhasil ditambahkan!', 'success');
      return pengeluaranBaru;
    } catch (err: any) {
      console.error('Error adding expense:', err);
      tampilkanPesan('Gagal menambahkan pengeluaran', 'danger');
      return null;
    } finally {
      aturSedangMenyimpan(false);
    }
  };

  const perbaruiPengeluaran = async (id: string, dataFormulir: DataFormulirPengeluaran) => {
    if (!pengguna) return false;
    aturSedangMenyimpan(true);
    aturKesalahan(null);
    try {
      const deskripsiBersih = dataFormulir.deskripsi ? dataFormulir.deskripsi.trim() : null;
      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: dataFormulir.nominal,
          category: dataFormulir.kategori,
          description: deskripsiBersih || null,
          date: dataFormulir.tanggal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', pengguna.id) // Scoping query ke pengguna yang login (Keamanan RLS)
        .select()
        .single();

      if (error) throw error;

      const pengeluaranDiperbarui: Pengeluaran = {
        id: data.id,
        idPengguna: data.user_id,
        nominal: Number(data.amount),
        kategori: data.category,
        deskripsi: data.description,
        tanggal: data.date,
        dibuatPada: data.created_at,
        diperbaruiPada: data.updated_at,
      };

      aturDaftarPengeluaran((sebelumnya) =>
        sebelumnya.map((exp) => (exp.id === id ? pengeluaranDiperbarui : exp))
      );
      tampilkanPesan('Pengeluaran berhasil diperbarui!', 'success');
      return true;
    } catch (err: any) {
      console.error('Error updating expense:', err);
      tampilkanPesan('Gagal memperbarui pengeluaran', 'danger');
      return false;
    } finally {
      aturSedangMenyimpan(false);
    }
  };

  const hapusPengeluaran = async (id: string) => {
    if (!pengguna) return false;
    aturIdSedangDihapus(id);
    aturKesalahan(null);
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', pengguna.id); // Scoping query ke pengguna yang login (Keamanan RLS)

      if (error) throw error;

      aturDaftarPengeluaran((sebelumnya) => sebelumnya.filter((exp) => exp.id !== id));
      tampilkanPesan('Pengeluaran berhasil dihapus!', 'success');
      return true;
    } catch (err: any) {
      console.error('Error deleting expense:', err);
      tampilkanPesan('Gagal menghapus pengeluaran', 'danger');
      return false;
    } finally {
      aturIdSedangDihapus(null);
    }
  };

  useEffect(() => {
    if (pengguna) {
      ambilPengeluaran();
    } else {
      aturDaftarPengeluaran([]);
    }
  }, [pengguna, ambilPengeluaran]);

  return {
    daftarPengeluaran,
    sedangMemuat,
    sedangMenyimpan,
    idSedangDihapus,
    kesalahan,
    ambilPengeluaran,
    tambahPengeluaran,
    perbaruiPengeluaran,
    hapusPengeluaran,
  };
};
