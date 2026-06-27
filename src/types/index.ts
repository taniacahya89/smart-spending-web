export interface Pengeluaran {
  id: string;
  idPengguna: string;
  nominal: number;
  kategori: KategoriPengeluaran;
  deskripsi: string | null;
  tanggal: string; // Format string tanggal ISO "YYYY-MM-DD"
  dibuatPada: string;
  diperbaruiPada: string;
}

export type KategoriPengeluaran =
  | "Makanan & Minuman"
  | "Transport"
  | "Belanja"
  | "Hiburan"
  | "Kesehatan"
  | "Pendidikan"
  | "Tagihan"
  | "Lainnya";

export interface DataFormulirPengeluaran {
  nominal: number;
  kategori: KategoriPengeluaran;
  deskripsi: string;
  tanggal: string;
}

export interface RingkasanKategori {
  kategori: KategoriPengeluaran;
  total: number;
  persentase: number;
  warna: string;
}

export interface StatistikDasbor {
  totalBulanIni: number;
  jumlahTransaksi: number;
  kategoriTerbesar: KategoriPengeluaran | null;
  pengeluaranHarian: { tanggal: string; total: number }[];
  rincianKategori: RingkasanKategori[];
}

export interface PesanPenasihat {
  peran: "user" | "assistant";
  konten: string;
  waktu: Date;
}

export interface PesanToast {
  id: string;
  pesan: string;
  jenis: "success" | "danger" | "info";
}

export interface ProfilPengguna {
  id: string;
  pendapatanBulanan: number;
  nama: string | null;
  dibuatPada: string;
  diperbaruiPada: string;
}

export interface StatusAnggaran {
  pendapatanBulanan: number;
  totalPengeluaran: number;
  sisa: number;
  rasio: number;
  status: 'hemat' | 'normal' | 'boros' | 'tidak_dapat_dinilai';
}

export interface AnalisisPenasihat {
  ringkasan: string;
  penilaian: 'hemat' | 'normal' | 'boros' | 'tidak_dapat_dinilai';
  alasan_penilaian: string;
  saran: string[];
  highlight: string;
}
