import { useMemo } from 'react';
import { Pengeluaran, StatistikDasbor, RingkasanKategori, KategoriPengeluaran } from '@/types';
import { PETA_KATEGORI } from '@/constants/categories';

export const gunakanStatistikDasbor = (daftarPengeluaran: Pengeluaran[]): StatistikDasbor => {
  return useMemo(() => {
    const sekarang = new Date();
    const tahunSekarang = sekarang.getFullYear();
    const bulanSekarang = sekarang.getMonth(); // Indeks dimulai dari 0

    // 1. Filter pengeluaran untuk bulan saat ini
    const pengeluaranBulanSekarang = daftarPengeluaran.filter((exp) => {
      const bagian = exp.tanggal.split('-');
      if (bagian.length !== 3) return false;
      const tahun = parseInt(bagian[0], 10);
      const bulan = parseInt(bagian[1], 10) - 1; // Indeks dimulai dari 0
      return tahun === tahunSekarang && bulan === bulanSekarang;
    });

    // 2. Total pengeluaran & jumlah transaksi bulan ini
    const totalBulanIni = pengeluaranBulanSekarang.reduce((jumlah, exp) => jumlah + exp.nominal, 0);
    const jumlahTransaksi = pengeluaranBulanSekarang.length;

    // 3. Rincian Kategori untuk bulan saat ini
    const totalPerKategori: Record<KategoriPengeluaran, number> = {} as Record<KategoriPengeluaran, number>;
    
    // Inisialisasi semua kategori dengan 0
    Object.keys(PETA_KATEGORI).forEach((kat) => {
      totalPerKategori[kat as KategoriPengeluaran] = 0;
    });

    pengeluaranBulanSekarang.forEach((exp) => {
      totalPerKategori[exp.kategori] = (totalPerKategori[exp.kategori] || 0) + exp.nominal;
    });

    const rincianKategori: RingkasanKategori[] = Object.entries(totalPerKategori)
      .map(([kat, total]) => {
        const kategori = kat as KategoriPengeluaran;
        const persentase = totalBulanIni > 0 ? (total / totalBulanIni) * 100 : 0;
        return {
          kategori,
          total,
          persentase: Math.round(persentase * 100) / 100, // bulatkan ke 2 desimal
          warna: PETA_KATEGORI[kategori]?.warna || '#94A3B8'
        };
      })
      .filter((item) => item.total > 0) // hanya tampilkan kategori dengan pengeluaran
      .sort((a, b) => b.total - a.total); // urutkan menurun

    // 4. Kategori Terbesar bulan ini
    const kategoriTerbesar = rincianKategori.length > 0 ? rincianKategori[0].kategori : null;

    // 5. Pengeluaran Harian selama 7 hari terakhir (termasuk hari ini)
    const pengeluaranHarian: { tanggal: string; total: number }[] = [];
    
    // Buat tanggal untuk 7 hari terakhir dalam format YYYY-MM-DD
    for (let i = 6; i >= 0; i--) {
      const objekTanggal = new Date();
      objekTanggal.setDate(sekarang.getDate() - i);
      const tahun = objekTanggal.getFullYear();
      const bulan = String(objekTanggal.getMonth() + 1).padStart(2, '0');
      const hari = String(objekTanggal.getDate()).padStart(2, '0');
      const stringTanggal = `${tahun}-${bulan}-${hari}`;

      // Jumlahkan semua pengeluaran yang cocok dengan tanggal ini
      const totalHarian = daftarPengeluaran
        .filter((exp) => exp.tanggal === stringTanggal)
        .reduce((jumlah, exp) => jumlah + exp.nominal, 0);

      // format label tanggal sebagai DD MMM (misalnya, "22 Jun")
      const labelHari = new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short'
      }).format(objekTanggal);

      pengeluaranHarian.push({
        tanggal: labelHari,
        total: totalHarian
      });
    }

    return {
      totalBulanIni,
      jumlahTransaksi,
      kategoriTerbesar,
      pengeluaranHarian,
      rincianKategori
    };
  }, [daftarPengeluaran]);
};
