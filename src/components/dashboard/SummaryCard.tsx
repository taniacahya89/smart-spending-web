import React from 'react';

interface AlatKartuRingkasan {
  judul: string;
  nilai: string | number;
  subjudul: string;
  ikon: React.ReactNode;
}

export const KartuRingkasan: React.FC<AlatKartuRingkasan> = ({
  judul,
  nilai,
  subjudul,
  ikon,
}) => {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:translate-y-[-2px] hover:shadow-xl hover:shadow-background/40 transition-all duration-300 select-none flex flex-col justify-between min-h-[140px]">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {judul}
          </span>
          <h3 className="text-2xl font-bold text-text-primary mt-2 mb-1 tracking-tight tabular-nums">
            {nilai}
          </h3>
        </div>
        
        {/* Pembungkus Ikon */}
        <div className="p-2 bg-background border border-border/80 rounded-lg text-text-secondary shadow-inner shrink-0 flex items-center justify-center">
          {ikon}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/20">
        <span className="text-xs text-text-secondary font-medium">
          {subjudul}
        </span>
      </div>
    </div>
  );
};
