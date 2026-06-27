import React, { createContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface TipeKonteksAutentikasi {
  pengguna: User | null;
  sesi: Session | null;
  sedangMemuat: boolean;
  kesalahan: AuthError | null;
  keluar: () => Promise<void>;
}

export const KonteksAutentikasi = createContext<TipeKonteksAutentikasi | undefined>(undefined);

export const PenyediaAutentikasi: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pengguna, aturPengguna] = useState<User | null>(null);
  const [sesi, aturSesi] = useState<Session | null>(null);
  const [sedangMemuat, aturSedangMemuat] = useState<boolean>(true);
  const [kesalahan, aturKesalahan] = useState<AuthError | null>(null);

  useEffect(() => {
    // Periksa sesi aktif saat mount
    const periksaSesi = async () => {
      try {
        const { data: { session: sesiAktif }, error: errorSesi } = await supabase.auth.getSession();
        if (errorSesi) throw errorSesi;
        aturSesi(sesiAktif);
        aturPengguna(sesiAktif?.user ?? null);
      } catch (err) {
        console.error('Error fetching initial Supabase auth session:', err);
        aturKesalahan(err as AuthError);
      } finally {
        aturSedangMemuat(false);
      }
    };

    periksaSesi();

    // Dengarkan perubahan status autentikasi
    const { data: { subscription } } = supabase.auth.onAuthStateChange((peristiwa, sesiSekarang) => {
      aturSesi(sesiSekarang);
      aturPengguna(sesiSekarang?.user ?? null);
      aturSedangMemuat(false);
      if (peristiwa === 'SIGNED_OUT') {
        aturKesalahan(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const keluar = async () => {
    aturSedangMemuat(true);
    try {
      const { error: errorKeluar } = await supabase.auth.signOut();
      if (errorKeluar) throw errorKeluar;
      aturPengguna(null);
      aturSesi(null);
    } catch (err) {
      console.error('Sign out error:', err);
      aturKesalahan(err as AuthError);
    } finally {
      aturSedangMemuat(false);
    }
  };

  return (
    <KonteksAutentikasi.Provider value={{ pengguna, sesi, sedangMemuat, kesalahan, keluar }}>
      {children}
    </KonteksAutentikasi.Provider>
  );
};
