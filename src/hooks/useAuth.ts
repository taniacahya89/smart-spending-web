import { useContext } from 'react';
import { KonteksAutentikasi } from '@/context/AuthContext';

export const gunakanAutentikasi = () => {
  const konteks = useContext(KonteksAutentikasi);
  if (konteks === undefined) {
    throw new Error('gunakanAutentikasi harus digunakan di dalam PenyediaAutentikasi');
  }
  return konteks;
};
