import React from 'react';
import { DAFTAR_KATEGORI } from '@/constants/categories';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface AlatFilterPengeluaran {
  pencarian: string;
  aturPencarian: (nilai: string) => void;
  kategori: string;
  aturKategori: (nilai: string) => void;
  bulan: string; // Format "YYYY-MM"
  aturBulan: (nilai: string) => void;
  urutkanBerdasarkan: string;
  aturUrutkanBerdasarkan: (nilai: string) => void;
}

export const FilterPengeluaran: React.FC<AlatFilterPengeluaran> = ({
  pencarian,
  aturPencarian,
  kategori,
  aturKategori,
  bulan,
  aturBulan,
  urutkanBerdasarkan,
  aturUrutkanBerdasarkan,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 bg-surface border border-border p-4 rounded-xl select-none">
      {/* Pencarian deskripsi */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={pencarian}
          onChange={(e) => aturPencarian(e.target.value)}
          placeholder="Cari pengeluaran..."
          className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      {/* Grid filter */}
      <div className="grid grid-cols-2 sm:flex items-center gap-3">
        {/* Filter Kategori */}
        <div className="relative">
          <select
            value={kategori}
            onChange={(e) => aturKategori(e.target.value)}
            className="w-full sm:w-44 bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
          >
            <option value="">Semua Kategori</option>
            {DAFTAR_KATEGORI.map((kat) => (
              <option key={kat} value={kat}>
                {kat}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-text-secondary">
            <Filter className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Pemilih Bulan */}
        <div className="relative">
          <input
            type="month"
            value={bulan}
            onChange={(e) => aturBulan(e.target.value)}
            className="w-full sm:w-40 bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Pilihan Pengurutan */}
        <div className="relative col-span-2 sm:col-span-1">
          <select
            value={urutkanBerdasarkan}
            onChange={(e) => aturUrutkanBerdasarkan(e.target.value)}
            className="w-full sm:w-48 bg-background border border-border rounded-lg pl-3 pr-8 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
          >
            <option value="date-desc">Tanggal Terbaru</option>
            <option value="date-asc">Tanggal Terlama</option>
            <option value="amount-desc">Nominal Terbesar</option>
            <option value="amount-asc">Nominal Terkecil</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-text-secondary">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
