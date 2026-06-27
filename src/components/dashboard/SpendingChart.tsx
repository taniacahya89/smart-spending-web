import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRupiah } from '@/lib/formatters';

interface AlatGrafikPengeluaran {
  data: { tanggal: string; total: number }[];
}

export const GrafikPengeluaran: React.FC<AlatGrafikPengeluaran> = ({ data }) => {
  
  // Pemformat label Sumbu Y (misal, 50000 -> Rp 50rb)
  const formatSumbuY = (nilai: number) => {
    if (nilai === 0) return 'Rp 0';
    if (nilai >= 1000000) {
      return `Rp ${(nilai / 1000000).toFixed(1).replace('.0', '')}jt`;
    }
    if (nilai >= 1000) {
      return `Rp ${(nilai / 1000).toFixed(0)}rb`;
    }
    return `Rp ${nilai}`;
  };

  // Komponen Tooltip Kustom yang cocok dengan tema dark fintech
  const TooltipKustom = ({ aktif, muatan }: any) => {
    if (aktif && muatan && muatan.length) {
      return (
        <div className="bg-surface border border-primary/30 p-3 rounded-xl shadow-xl select-none">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">
            {muatan[0].payload.tanggal}
          </p>
          <p className="text-sm font-bold text-primary tabular-nums">
            {formatRupiah(muatan[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 select-none w-full h-[320px] flex flex-col justify-between">
      <div className="mb-4">
        <h4 className="text-sm font-bold text-text-primary">Tren Pengeluaran</h4>
        <span className="text-[11px] text-text-secondary">Statistik pengeluaran harian dalam 7 hari terakhir</span>
      </div>

      <div className="flex-1 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2D3A" vertical={false} />
            <XAxis
              dataKey="tanggal"
              stroke="#8B8FA8"
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#8B8FA8"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatSumbuY}
              dx={-5}
            />
            <Tooltip content={<TooltipKustom />} cursor={{ fill: '#6C63FF', opacity: 0.05, radius: 4 }} />
            <Bar
              dataKey="total"
              fill="#6C63FF"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
