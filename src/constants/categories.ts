import { KategoriPengeluaran } from "@/types";

export interface InfoKategori {
  nama: KategoriPengeluaran;
  warna: string; // hex
  kelasBg: string; // tailwind bg color (soft/muted)
  kelasTeks: string; // tailwind text color
  kelasBingkai: string; // tailwind border color
  ikon: string; // nama ikon lucide
}

export const DAFTAR_KATEGORI: KategoriPengeluaran[] = [
  "Makanan & Minuman",
  "Transport",
  "Belanja",
  "Hiburan",
  "Kesehatan",
  "Pendidikan",
  "Tagihan",
  "Lainnya"
];

export const PETA_KATEGORI: Record<KategoriPengeluaran, InfoKategori> = {
  "Makanan & Minuman": {
    nama: "Makanan & Minuman",
    warna: "#F97316",
    kelasBg: "bg-orange-500/10",
    kelasTeks: "text-orange-400",
    kelasBingkai: "border-orange-500/20",
    ikon: "Utensils"
  },
  "Transport": {
    nama: "Transport",
    warna: "#38BDF8",
    kelasBg: "bg-sky-500/10",
    kelasTeks: "text-sky-400",
    kelasBingkai: "border-sky-500/20",
    ikon: "Car"
  },
  "Belanja": {
    nama: "Belanja",
    warna: "#A78BFA",
    kelasBg: "bg-violet-500/10",
    kelasTeks: "text-violet-400",
    kelasBingkai: "border-violet-500/20",
    ikon: "ShoppingBag"
  },
  "Hiburan": {
    nama: "Hiburan",
    warna: "#FB7185",
    kelasBg: "bg-rose-500/10",
    kelasTeks: "text-rose-400",
    kelasBingkai: "border-rose-500/20",
    ikon: "Tv"
  },
  "Kesehatan": {
    nama: "Kesehatan",
    warna: "#34D399",
    kelasBg: "bg-emerald-500/10",
    kelasTeks: "text-emerald-400",
    kelasBingkai: "border-emerald-500/20",
    ikon: "Heart"
  },
  "Pendidikan": {
    nama: "Pendidikan",
    warna: "#60A5FA",
    kelasBg: "bg-blue-500/10",
    kelasTeks: "text-blue-400",
    kelasBingkai: "border-blue-500/20",
    ikon: "GraduationCap"
  },
  "Tagihan": {
    nama: "Tagihan",
    warna: "#FBBF24",
    kelasBg: "bg-amber-500/10",
    kelasTeks: "text-amber-400",
    kelasBingkai: "border-amber-500/20",
    ikon: "CreditCard"
  },
  "Lainnya": {
    nama: "Lainnya",
    warna: "#94A3B8",
    kelasBg: "bg-slate-500/10",
    kelasTeks: "text-slate-400",
    kelasBingkai: "border-slate-500/20",
    ikon: "HelpCircle"
  }
};
