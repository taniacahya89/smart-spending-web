import React, { createContext, useContext, useState, useCallback } from 'react';
import { PesanToast } from '@/types';

interface TipeKonteksPesan {
  daftarPesan: PesanToast[];
  tampilkanPesan: (pesan: string, jenis?: 'success' | 'danger' | 'info') => void;
  hapusPesan: (id: string) => void;
}

const KonteksPesan = createContext<TipeKonteksPesan | undefined>(undefined);

export const PenyediaPesan: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [daftarPesan, aturDaftarPesan] = useState<PesanToast[]>([]);

  const hapusPesan = useCallback((id: string) => {
    aturDaftarPesan((sebelumnya) => sebelumnya.filter((t) => t.id !== id));
  }, []);

  const tampilkanPesan = useCallback((pesan: string, jenis: 'success' | 'danger' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    aturDaftarPesan((sebelumnya) => [...sebelumnya, { id, pesan, jenis }]);

    // Hilang otomatis setelah 3 detik
    setTimeout(() => {
      hapusPesan(id);
    }, 3000);
  }, [hapusPesan]);

  return (
    <KonteksPesan.Provider value={{ daftarPesan, tampilkanPesan, hapusPesan }}>
      {children}
      {/* Tata letak rendering portal pesan */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
        {daftarPesan.map((pesanSatuan) => (
          <div
            key={pesanSatuan.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-0 animate-slide-in-right ${
              pesanSatuan.jenis === 'success'
                ? 'bg-surface border-success/30 text-success'
                : pesanSatuan.jenis === 'danger'
                ? 'bg-surface border-danger/30 text-danger'
                : 'bg-surface border-info/30 text-info'
            }`}
          >
            <div className="flex items-center gap-3">
              {pesanSatuan.jenis === 'success' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {pesanSatuan.jenis === 'danger' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {pesanSatuan.jenis === 'info' && (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-text-primary text-sm font-medium">{pesanSatuan.pesan}</span>
            </div>
            <button
              onClick={() => hapusPesan(pesanSatuan.id)}
              className="text-text-secondary hover:text-text-primary ml-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </KonteksPesan.Provider>
  );
};

export const gunakanPesan = () => {
  const konteks = useContext(KonteksPesan);
  if (!konteks) {
    throw new Error('gunakanPesan harus digunakan dalam PenyediaPesan');
  }
  return konteks;
};
