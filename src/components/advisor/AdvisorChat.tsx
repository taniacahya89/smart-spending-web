import React, { useState, useRef, useEffect } from 'react';
import { PesanPenasihat } from '@/types';
import { IndikatorMengetik } from './TypingIndicator';
import { Send, Sparkles } from 'lucide-react';

interface AlatObrolanPenasihat {
  riwayat: PesanPenasihat[];
  padaKirimPesan: (pesan: string) => Promise<void>;
  sedangMemuat: boolean;
}

export const ObrolanPenasihat: React.FC<AlatObrolanPenasihat> = ({
  riwayat,
  padaKirimPesan,
  sedangMemuat,
}) => {
  const [masukanTeks, aturMasukanTeks] = useState<string>('');
  const refUjungPesan = useRef<HTMLDivElement>(null);

  const gulirKeBawah = () => {
    refUjungPesan.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    gulirKeBawah();
  }, [riwayat, sedangMemuat]);

  const tanganiKirim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!masukanTeks.trim() || sedangMemuat) return;
    padaKirimPesan(masukanTeks);
    aturMasukanTeks('');
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-xl flex flex-col h-[500px] select-none justify-between">
      {/* Header obrolan mini */}
      <div className="flex items-center gap-2 pb-3.5 border-b border-border/40 mb-3 shrink-0">
        <Sparkles className="w-4.5 h-4.5 text-primary" />
        <div>
          <h4 className="text-sm font-bold text-text-primary">Tanya Lanjutan ke AI</h4>
          <span className="text-[10px] text-text-secondary">Tanyakan tips menghemat, saran belanja, dll.</span>
        </div>
      </div>

      {/* Area Gulir Pesan */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 select-text">
        {riwayat.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-text-secondary">
            <p className="text-xs font-semibold max-w-[280px] leading-relaxed">
              Belum ada obrolan. Ketik pertanyaanmu di bawah untuk berkonsultasi lebih lanjut dengan AI Advisor!
            </p>
          </div>
        ) : (
          riwayat.map((msg, indeks) => {
            const apakahUser = msg.peran === 'user';
            return (
              <div
                key={indeks}
                className={`flex w-full ${apakahUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    apakahUser
                      ? 'bg-[#6C63FF] text-white rounded-tr-sm shadow-md shadow-[#6C63FF]/15'
                      : 'bg-[#2A2D3A] border border-border/50 text-text-primary rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.konten}</p>
                  <span className={`block text-[9px] text-right mt-1.5 ${apakahUser ? 'text-white/70' : 'text-text-secondary'}`}>
                    {new Intl.DateTimeFormat('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(msg.waktu)}
                  </span>
                </div>
              </div>
            );
          })
        )}

        {/* Indikator Mengetik AI */}
        {sedangMemuat && (
          <div className="flex justify-start">
            <IndikatorMengetik />
          </div>
        )}
        <div ref={refUjungPesan} />
      </div>

      {/* Kotak Formulir Input */}
      <form onSubmit={tanganiKirim} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={masukanTeks}
          onChange={(e) => aturMasukanTeks(e.target.value)}
          placeholder="Tanyakan sesuatu ke advisor..."
          className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          disabled={sedangMemuat}
        />
        <button
          type="submit"
          disabled={sedangMemuat || !masukanTeks.trim()}
          className="p-3 bg-primary hover:bg-primary-hover text-text-primary rounded-xl transition-all flex items-center justify-center shrink-0 active:scale-[0.97] disabled:bg-primary/50 disabled:cursor-not-allowed shadow-md shadow-primary/15"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
};
