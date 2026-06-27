import React, { useState, useEffect } from 'react';
import { DataFormulirPengeluaran, KategoriPengeluaran, Pengeluaran } from '@/types';
import { DAFTAR_KATEGORI } from '@/constants/categories';
import { AlertCircle, Loader2 } from 'lucide-react';
import { dapatkanStringTanggalLokal } from '@/lib/formatters';

interface AlatFormulirPengeluaran {
  padaKirim: (data: DataFormulirPengeluaran) => Promise<boolean>;
  dataAwal?: Pengeluaran | null;
  padaBatal: () => void;
  sedangMenyimpan: boolean;
}

export const FormulirPengeluaran: React.FC<AlatFormulirPengeluaran> = ({
  padaKirim,
  dataAwal,
  padaBatal,
  sedangMenyimpan,
}) => {
  const [masukanNominal, aturMasukanNominal] = useState<string>('');
  const [dataFormulir, aturDataFormulir] = useState<DataFormulirPengeluaran>({
    nominal: 0,
    kategori: '' as KategoriPengeluaran,
    tanggal: dapatkanStringTanggalLokal(),
    deskripsi: '',
  });

  const [daftarKesalahan, aturDaftarKesalahan] = useState<Partial<Record<keyof DataFormulirPengeluaran, string>>>({});

  // Isi formulir jika dataAwal diberikan (Mode Edit)
  useEffect(() => {
    if (dataAwal) {
      aturDataFormulir({
        nominal: dataAwal.nominal,
        kategori: dataAwal.kategori,
        tanggal: dataAwal.tanggal,
        deskripsi: dataAwal.deskripsi || '',
      });
      aturMasukanNominal(dataAwal.nominal.toLocaleString('id-ID'));
    } else {
      aturDataFormulir({
        nominal: 0,
        kategori: '' as KategoriPengeluaran,
        tanggal: dapatkanStringTanggalLokal(),
        deskripsi: '',
      });
      aturMasukanNominal('');
    }
    aturDaftarKesalahan({});
  }, [dataAwal]);

  // Tangani pemformatan nominal (pemisah ribuan otomatis)
  const tanganiPerubahanNominal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nilaiMentah = e.target.value.replace(/[^\d]/g, ''); // Hanya izinkan digit
    const nilaiNumerik = nilaiMentah ? parseInt(nilaiMentah, 10) : 0;
    
    aturDataFormulir((sebelumnya) => ({ ...sebelumnya, nominal: nilaiNumerik }));
    aturMasukanNominal(nilaiNumerik > 0 ? nilaiNumerik.toLocaleString('id-ID') : '');

    // Hapus pesan kesalahan
    if (daftarKesalahan.nominal) {
      aturDaftarKesalahan((sebelumnya) => ({ ...sebelumnya, nominal: undefined }));
    }
  };

  const tanganiPerubahan = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    aturDataFormulir((sebelumnya) => ({ ...sebelumnya, [name]: value }));

    // Hapus pesan kesalahan
    if (daftarKesalahan[name as keyof DataFormulirPengeluaran]) {
      aturDaftarKesalahan((sebelumnya) => ({ ...sebelumnya, [name]: undefined }));
    }
  };

  const validasi = (): boolean => {
    const kesalahanBaru: Partial<Record<keyof DataFormulirPengeluaran, string>> = {};
    const stringHariIni = dapatkanStringTanggalLokal();

    // Validasi Nominal
    if (!dataFormulir.nominal || dataFormulir.nominal <= 0) {
      kesalahanBaru.nominal = 'Nominal harus diisi dan lebih besar dari 0';
    }

    // Validasi Kategori
    if (!dataFormulir.kategori) {
      kesalahanBaru.kategori = 'Kategori wajib dipilih';
    } else if (!DAFTAR_KATEGORI.includes(dataFormulir.kategori)) {
      kesalahanBaru.kategori = 'Kategori tidak valid';
    }

    // Validasi Tanggal
    if (!dataFormulir.tanggal) {
      kesalahanBaru.tanggal = 'Tanggal wajib diisi';
    } else if (dataFormulir.tanggal > stringHariIni) {
      kesalahanBaru.tanggal = 'Tanggal tidak boleh di masa depan';
    }

    // Validasi Deskripsi
    if (dataFormulir.deskripsi && dataFormulir.deskripsi.trim().length > 200) {
      kesalahanBaru.deskripsi = 'Deskripsi maksimal 200 karakter';
    }

    aturDaftarKesalahan(kesalahanBaru);
    return Object.keys(kesalahanBaru).length === 0;
  };

  const tanganiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validasi()) return;
    
    // Trim deskripsi untuk menghindari whitespace kosong di basis data
    const dataBersih = {
      ...dataFormulir,
      deskripsi: dataFormulir.deskripsi ? dataFormulir.deskripsi.trim() : ''
    };

    const berhasil = await padaKirim(dataBersih);
    if (berhasil && !dataAwal) {
      // Atur ulang formulir jika ini entri baru
      aturDataFormulir({
        nominal: 0,
        kategori: '' as KategoriPengeluaran,
        tanggal: dapatkanStringTanggalLokal(),
        deskripsi: '',
      });
      aturMasukanNominal('');
    }
  };

  return (
    <form onSubmit={tanganiSubmit} className="space-y-5 text-text-primary select-none">
      {/* Input Nominal */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Nominal (Rupiah) <span className="text-danger">*</span>
        </label>
        <div className="relative rounded-lg shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-text-secondary text-sm font-semibold">Rp</span>
          </div>
          <input
            type="text"
            value={masukanNominal}
            onChange={tanganiPerubahanNominal}
            placeholder="0"
            className={`w-full bg-background border rounded-lg pl-10 pr-4 py-2.5 text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-primary ${
              daftarKesalahan.nominal ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
            }`}
            disabled={sedangMenyimpan}
          />
        </div>
        {daftarKesalahan.nominal && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{daftarKesalahan.nominal}</span>
          </p>
        )}
      </div>

      {/* Pilihan Kategori */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Kategori <span className="text-danger">*</span>
        </label>
        <select
          name="kategori"
          value={dataFormulir.kategori}
          onChange={tanganiPerubahan}
          className={`w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
            daftarKesalahan.kategori ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
          }`}
          disabled={sedangMenyimpan}
        >
          <option value="" disabled>-- Pilih Kategori --</option>
          {DAFTAR_KATEGORI.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>
        {daftarKesalahan.kategori && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{daftarKesalahan.kategori}</span>
          </p>
        )}
      </div>

      {/* Pemilih Tanggal */}
      <div>
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Tanggal <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          name="tanggal"
          value={dataFormulir.tanggal}
          onChange={tanganiPerubahan}
          max={dapatkanStringTanggalLokal()}
          className={`w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
            daftarKesalahan.tanggal ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
          }`}
          disabled={sedangMenyimpan}
        />
        {daftarKesalahan.tanggal && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{daftarKesalahan.tanggal}</span>
          </p>
        )}
      </div>

      {/* Area Teks Deskripsi */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Deskripsi (Opsional)
          </label>
          <span className="text-[10px] text-text-secondary">
            {dataFormulir.deskripsi?.length || 0}/200
          </span>
        </div>
        <textarea
          name="deskripsi"
          value={dataFormulir.deskripsi}
          onChange={tanganiPerubahan}
          rows={3}
          maxLength={200}
          placeholder="Misal: Beli nasi goreng pak kumis dekat kosan"
          className={`w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary ${
            daftarKesalahan.deskripsi ? 'border-danger/50 focus:border-danger' : 'border-border focus:border-primary'
          }`}
          disabled={sedangMenyimpan}
        />
        {daftarKesalahan.deskripsi && (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-danger">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{daftarKesalahan.deskripsi}</span>
          </p>
        )}
      </div>

      {/* Tombol Simpan / Batal */}
      <div className="flex items-center justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={padaBatal}
          className="px-4 py-2 text-sm font-semibold border border-border rounded-lg text-text-primary hover:bg-surface transition-all active:scale-[0.97]"
          disabled={sedangMenyimpan}
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-primary hover:bg-primary-hover text-text-primary rounded-lg transition-all shadow-md shadow-primary/10 active:scale-[0.97]"
          disabled={sedangMenyimpan}
        >
          {sedangMenyimpan ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </>
          ) : (
            <span>Simpan</span>
          )}
        </button>
      </div>
    </form>
  );
};
