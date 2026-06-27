import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { ProfilPengguna } from '@/types';
import { gunakanAutentikasi } from '@/hooks/useAuth';
import { gunakanPesan } from '@/context/ToastContext';

export const gunakanProfil = () => {
  const { pengguna } = gunakanAutentikasi();
  const { tampilkanPesan } = gunakanPesan();
  const [profil, aturProfil] = useState<ProfilPengguna | null>(null);
  const [sedangMemuat, aturSedangMemuat] = useState<boolean>(false);
  const [sedangMenyimpan, aturSedangMenyimpan] = useState<boolean>(false);
  const [kesalahan, aturKesalahan] = useState<string | null>(null);

  const ambilProfil = useCallback(async () => {
    if (!pengguna) return;
    aturSedangMemuat(true);
    aturKesalahan(null);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', pengguna.id)
        .single();

      if (error) {
        // Tangani kasus di mana profil belum dibuat (PGRST116)
        if (error.code === 'PGRST116') {
          const namaBawaan = pengguna.user_metadata?.name || pengguna.email?.split('@')[0] || 'User';
          const { data: dataBaru, error: errorInsert } = await supabase
            .from('user_profiles')
            .insert({
              id: pengguna.id,
              name: namaBawaan,
              monthly_income: 0,
            })
            .select()
            .single();

          if (errorInsert) throw errorInsert;

          aturProfil({
            id: dataBaru.id,
            pendapatanBulanan: Number(dataBaru.monthly_income),
            nama: dataBaru.name,
            dibuatPada: dataBaru.created_at,
            diperbaruiPada: dataBaru.updated_at,
          });
        } else {
          throw error;
        }
      } else {
        aturProfil({
          id: data.id,
          pendapatanBulanan: Number(data.monthly_income),
          nama: data.name,
          dibuatPada: data.created_at,
          diperbaruiPada: data.updated_at,
        });
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      aturKesalahan(err.message || 'Gagal mengambil data profil');
    } finally {
      aturSedangMemuat(false);
    }
  }, [pengguna]);

  const perbaruiProfil = async (dataInput: { pendapatanBulanan: number; nama: string }) => {
    if (!pengguna) return false;
    aturSedangMenyimpan(true);
    aturKesalahan(null);
    try {
      const namaBersih = dataInput.nama ? dataInput.nama.trim() : '';
      const { data: dataDiperbarui, error } = await supabase
        .from('user_profiles')
        .update({
          name: namaBersih,
          monthly_income: dataInput.pendapatanBulanan,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pengguna.id)
        .select()
        .single();

      if (error) throw error;

      aturProfil({
        id: dataDiperbarui.id,
        pendapatanBulanan: Number(dataDiperbarui.monthly_income),
        nama: dataDiperbarui.name,
        dibuatPada: dataDiperbarui.created_at,
        diperbaruiPada: dataDiperbarui.updated_at,
      });

      tampilkanPesan('Profil berhasil diperbarui!', 'success');
      return true;
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      aturKesalahan(err.message || 'Gagal memperbarui profil');
      tampilkanPesan('Gagal memperbarui profil', 'danger');
      return false;
    } finally {
      aturSedangMenyimpan(false);
    }
  };

  useEffect(() => {
    if (pengguna) {
      ambilProfil();
    } else {
      aturProfil(null);
    }
  }, [pengguna, ambilProfil]);

  return {
    profil,
    sedangMemuat,
    sedangMenyimpan,
    kesalahan,
    ambilProfil,
    perbaruiProfil,
  };
};
