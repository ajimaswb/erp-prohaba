# Rencana Implementasi Keseluruhan (Master Plan) - ERP Prohaba Jaya Mandiri

Dokumen ini adalah cetak biru (blueprint) teknis untuk membangun seluruh sisa modul ERP Prohaba Jaya Mandiri secara komprehensif, menghubungkan alur kerja dari *Site/Tambang* hingga ke *Top Management*.

> [!NOTE]
> Modul **Keuangan (Finance)** telah selesai pada Fase 1. Plan ini difokuskan pada penyempurnaan UI/UX, integrasi knowledge Accurate, serta pengembangan modul S-Curve, Logistik, dan HR.

---

## 1. Modul Keuangan (Adaptasi Struktur Accurate)

Sesuai arahan, sistem ERP ini untuk sementara **tidak akan langsung terintegrasi dengan API Accurate Online**, melainkan akan **mengadaptasi struktur basis data dan knowledge Accurate** terlebih dahulu.

### Alur Adaptasi:
1. **Chart of Accounts (COA)**: Menggunakan kodifikasi standar Accurate (Aktiva, Kewajiban, Ekuitas, Pendapatan, HPP, Beban).
2. **Jurnal Umum (General Ledger)**: Setiap transaksi dari modul lain (Payroll, Site Purchase, dll) akan otomatis men- *trigger* pembuatan Jurnal Voucher yang formatnya 100% kompatibel dengan import/export Accurate.
3. **Laporan Keuangan**: Laba/Rugi dan Neraca yang dihasilkan oleh sistem ERP ini akan mencerminkan struktur pemetaan yang biasa digunakan oleh pengguna Accurate.
4. Ketika Prohaba siap bermigrasi ke Accurate Online, sistem ini hanya perlu mengaktifkan *API Push* karena strukturnya sudah sama (*Seamless Transition*).

---

## 2. Modul Operasional (S-Curve & Progress)

Modul ini adalah jantung dari operasional tambang, memungkinkan Top Management memonitor deviasi proyek.

### Alur Input Progress (End-to-End):
**Menjawab pertanyaan Anda: "Bagaimana cara menginput progress project?"**

1. **Setup Baseline (Engineering)**: 
   - Di awal proyek, Engineering menginput *Bill of Quantities (BoQ)* beserta bobotnya (%).
   - Engineering menentukan *Baseline Schedule* (rencana progres kumulatif 0-100% dari minggu 1 hingga selesai).
2. **Input Lapangan (PJO / Site Manager)**:
   - Setiap minggu, PJO membuka halaman **Progress Input**.
   - PJO memilih **Proyek Aktif** dan **Item Pekerjaan BoQ** (misal: "1.1.1 Pemasangan Tiang Pancang").
   - PJO memasukkan angka *Actual Progress* (%) yang telah diselesaikan.
   - PJO **diwajibkan** melampirkan *Catatan* dan *Foto Bukti Lapangan* (diunggah ke sistem).
3. **Kalkulasi Otomatis (Sistem)**:
   - Sistem akan mengalikan progress input PJO dengan *Weight* (Bobot) dari BoQ item tersebut untuk mendapatkan bobot aktual minggu itu.
   - Angka kumulatif tersebut akan digambarkan sebagai **Garis Aktual (Hijau/Merah)** pada grafik S-Curve.
4. **Monitoring (Top Management)**:
   - Top management melihat grafik. Sistem mengkalkulasi *Deviasi* = `Actual % - Baseline %`.
   - Jika deviasi negatif (terlambat), sistem otomatis memberi warna indikator merah.

---

## 3. Modul Logistik & Pembelian (Anti Mark-Up System)

Masalah utama yang diselesaikan: manipulasi harga / *mark-up* oleh orang lapangan, serta alur pengadaan yang terputus.

### A. Material Request (MR) & Procurement (PO)
* **Alur Logika**:
  1. **PJO** membuat MR dari *site* tambang. PJO hanya bisa *request* barang dan kuantitas (tanpa harga).
  2. **Logistik (Kantor Pusat)** menerima MR, mencari *Vendor*, dan menerbitkan **Purchase Order (PO)**.
  3. PO yang diterbitkan otomatis masuk ke modul **Keuangan** sebagai Hutang (Account Payable).

### B. Pembelian Site (Site Purchase) & Anti Mark-up Control
* **Alur Logika**:
  1. Untuk barang *urgent* yang dibeli langsung di sekitar tambang, **PJO** menginput `SitePurchase` beserta nota/struk.
  2. Sistem membandingkan Harga PJO dengan `PriceReference` (Master Harga).
  3. > [!IMPORTANT]
     > **Sistem Deteksi Mark-up**: Jika harga inputan > 10% di atas harga referensi, otomatis terkena **Bendera Merah (Flagged)**.
  4. Transaksi *Flagged* **terkunci** dan tidak bisa di-reimburse oleh Finance tanpa Approval khusus dari Top Management.

---

## 4. Modul HR & Payroll Automasi (UI Matang & Elegan)

UI/UX modul ini telah direvisi menjadi lebih profesional, elegan, menghilangkan kesan "kaku/bot", dan mengganti style emoji dengan icon modern (Lucide React), warna korporat (Navy/Orange), serta elemen *card* ber- *shadow* halus.

### A. Absensi Lapangan (Attendance)
* **Alur Logika**:
  1. **PJO** melakukan input absensi harian (`HADIR`, `LEMBUR`, `ALPA`, `SAKIT`). 
  2. Input ini bersifat *real-time* dan tidak bisa dimanipulasi mundur jauh ke belakang tanpa *log* audit.

### B. Payroll Automation & Approval berjenjang
* **Alur Logika**:
  1. Akhir bulan, HRD menekan tombol *"Generate Payroll"*.
  2. Sistem otomatis menghitung THP (Take Home Pay) berdasarkan absen lapangan, gaji pokok, dan lembur.
  3. **Visualisasi Approval**: Terdapat *Progress Bar* persetujuan yang elegan di layar:
     `DRAFT` ➔ `HRD` ➔ `FINANCE` ➔ `TOP MGMT`
  4. Setelah Top Management setuju, Finance menekan *"Bayar"*, dan otomatis masuk ke Jurnal Keuangan.

---

## User Review Required

Silakan periksa rencana di atas:
1. Apakah penjelasan **Alur Input Progress (S-Curve)** sudah cukup rinci dan menjawab kebingungan Anda?
2. Apakah adaptasi **struktur Knowledge Accurate** (sebagai fondasi awal sebelum full API integrasi) sudah sesuai dengan strategi operasional saat ini?

Pilih tombol **Proceed** jika Anda sudah sepakat dengan seluruh rencana ini.
