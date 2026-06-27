import React, { useState, useMemo } from 'react';
import { gunakanPengeluaran } from '@/hooks/useExpenses';
import { FormulirPengeluaran } from '@/components/expense/ExpenseForm';
import { DaftarPengeluaran } from '@/components/expense/ExpenseList';
import { FilterPengeluaran } from '@/components/expense/ExpenseFilters';
import { DialogKonfirmasi } from '@/components/ui/ConfirmationDialog';
import { Pengeluaran } from '@/types';
import { Plus, X, ReceiptText } from 'lucide-react';

export const HalamanCatatanPengeluaran: React.FC = () => {
  const {
    daftarPengeluaran,
    sedangMemuat,
    sedangMenyimpan,
    idSedangDihapus,
    tambahPengeluaran,
    perbaruiPengeluaran,
    hapusPengeluaran,
  } = gunakanPengeluaran();

  // State Filter
  const [pencarian, aturPencarian] = useState('');
  const [kategori, aturKategori] = useState('');
  const [bulan, aturBulan] = useState(''); // Format YYYY-MM
  const [urutkanBerdasarkan, aturUrutkanBerdasarkan] = useState('date-desc');

  // State Modal & Dialog
  const [apakahTambahTerbuka, aturApakahTambahTerbuka] = useState(false);
  const [pengeluaranSedangDiubah, aturPengeluaranSedangDiubah] = useState<Pengeluaran | null>(null);
  const [idKonfirmasiHapus, aturIdKonfirmasiHapus] = useState<string | null>(null);

  // Hitung pengeluaran yang disaring & diurutkan
  const daftarPengeluaranDisaring = useMemo(() => {
    let hasil = [...daftarPengeluaran];

    // Pencarian deskripsi (real-time)
    if (pencarian.trim()) {
      const kueri = pencarian.toLowerCase();
      hasil = hasil.filter((exp) =>
        (exp.deskripsi || '').toLowerCase().includes(kueri)
      );
    }

    // Filter kategori
    if (kategori) {
      hasil = hasil.filter((exp) => exp.kategori === kategori);
    }

    // Filter bulan (input type=month memetakan YYYY-MM)
    if (bulan) {
      hasil = hasil.filter((exp) => exp.tanggal.startsWith(bulan));
    }

    // Pilihan pengurutan
    hasil.sort((a, b) => {
      if (urutkanBerdasarkan === 'date-desc') {
        const selisih = new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
        return selisih !== 0 ? selisih : b.dibuatPada.localeCompare(a.dibuatPada);
      }
      if (urutkanBerdasarkan === 'date-asc') {
        const selisih = new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
        return selisih !== 0 ? selisih : a.dibuatPada.localeCompare(b.dibuatPada);
      }
      if (urutkanBerdasarkan === 'amount-desc') {
        return b.nominal - a.nominal;
      }
      if (urutkanBerdasarkan === 'amount-asc') {
        return a.nominal - b.nominal;
      }
      return 0;
    });

    return hasil;
  }, [daftarPengeluaran, pencarian, kategori, bulan, urutkanBerdasarkan]);

  // Handler Event
  const tanganiSubmitTambah = async (data: any) => {
    const res = await tambahPengeluaran(data);
    if (res) {
      aturApakahTambahTerbuka(false);
      return true;
    }
    return false;
  };

  const tanganiSubmitUbah = async (data: any) => {
    if (!pengeluaranSedangDiubah) return false;
    const berhasil = await perbaruiPengeluaran(pengeluaranSedangDiubah.id, data);
    if (berhasil) {
      aturPengeluaranSedangDiubah(null);
      return true;
    }
    return false;
  };

  const tanganiPemicuHapus = (id: string) => {
    aturIdKonfirmasiHapus(id);
  };

  const tanganiKonfirmasiHapus = async () => {
    if (!idKonfirmasiHapus) return;
    const berhasil = await hapusPengeluaran(idKonfirmasiHapus);
    if (berhasil) {
      aturIdKonfirmasiHapus(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bar Header Atas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none pb-2 border-b border-border/20">
        <div>
          <div className="flex items-center gap-2 text-text-primary">
            <ReceiptText className="w-5 h-5 text-primary shrink-0" />
            <h2 className="text-xl font-bold">Catatan Pengeluaran</h2>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">Kelola, cari, dan kelompokkan seluruh transaksi pengeluaranmu.</p>
        </div>

        <button
          onClick={() => aturApakahTambahTerbuka(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-text-primary text-sm font-semibold rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-[0.97]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Tambah Transaksi</span>
        </button>
      </div>

      {/* Filter Real-time */}
      <FilterPengeluaran
        pencarian={pencarian}
        aturPencarian={aturPencarian}
        kategori={kategori}
        aturKategori={aturKategori}
        bulan={bulan}
        aturBulan={aturBulan}
        urutkanBerdasarkan={urutkanBerdasarkan}
        aturUrutkanBerdasarkan={aturUrutkanBerdasarkan}
      />

      {/* Area Daftar Transaksi Utama */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-xs text-text-secondary select-none font-semibold px-2">
          <span>Menampilkan {daftarPengeluaranDisaring.length} dari {daftarPengeluaran.length} pengeluaran</span>
          { (pencarian || kategori || bulan) && (
            <button
              onClick={() => {
                aturPencarian('');
                aturKategori('');
                aturBulan('');
              }}
              className="text-primary hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <DaftarPengeluaran
          daftarPengeluaran={daftarPengeluaranDisaring}
          padaUbah={aturPengeluaranSedangDiubah}
          padaHapus={tanganiPemicuHapus}
          idSedangDihapus={idSedangDihapus}
          sedangMemuat={sedangMemuat}
          padaKlikTambah={() => aturApakahTambahTerbuka(true)}
        />
      </div>

      {/* Dialog Modal: Tambah Pengeluaran */}
      {apakahTambahTerbuka && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/40 mb-4 select-none">
              <h3 className="font-bold text-base text-text-primary">Tambah Pengeluaran</h3>
              <button
                onClick={() => aturApakahTambahTerbuka(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-all active:scale-[0.97]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FormulirPengeluaran
              padaKirim={tanganiSubmitTambah}
              padaBatal={() => aturApakahTambahTerbuka(false)}
              sedangMenyimpan={sedangMenyimpan}
            />
          </div>
        </div>
      )}

      {/* Dialog Modal: Edit Pengeluaran */}
      {pengeluaranSedangDiubah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/40 mb-4 select-none">
              <h3 className="font-bold text-base text-text-primary">Edit Pengeluaran</h3>
              <button
                onClick={() => aturPengeluaranSedangDiubah(null)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background transition-all active:scale-[0.97]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FormulirPengeluaran
              padaKirim={tanganiSubmitUbah}
              dataAwal={pengeluaranSedangDiubah}
              padaBatal={() => aturPengeluaranSedangDiubah(null)}
              sedangMenyimpan={sedangMenyimpan}
            />
          </div>
        </div>
      )}

      {/* Modal Kustom Konfirmasi Hapus */}
      <DialogKonfirmasi
        apakahTerbuka={idKonfirmasiHapus !== null}
        judul="Hapus Pengeluaran?"
        pesan="Yakin mau hapus pengeluaran ini? Tindakan ini tidak dapat dibatalkan."
        labelKonfirmasi="Hapus"
        labelBatal="Batal"
        padaKonfirmasi={tanganiKonfirmasiHapus}
        padaBatal={() => aturIdKonfirmasiHapus(null)}
        apakahSedangKonfirmasi={idSedangDihapus === idKonfirmasiHapus}
      />
    </div>
  );
};
export default HalamanCatatanPengeluaran;
