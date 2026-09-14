# Rencana Implementasi Keseluruhan (Master Plan) - ERP Prohaba Jaya Mandiri

Dokumen ini adalah cetak biru (blueprint) teknis untuk membangun seluruh sisa modul ERP Prohaba Jaya Mandiri secara komprehensif, menghubungkan alur kerja dari *Site/Tambang* hingga ke *Top Management*.

> [!NOTE]
> Modul **Keuangan (Finance/Accurate Standard)** telah selesai pada Fase 1. Plan ini akan fokus pada Fase 2 (Operasional & Logistik) dan Fase 3 (HR & Payroll).

---

## 1. Modul Operasional (S-Curve & Engineering)

Modul ini adalah jantung dari operasional tambang, memungkinkan Top Management memonitor apakah proyek berjalan sesuai jadwal (Baseline) atau terlambat (Actual).

### A. S-Curve & Progress Lapangan (`/scurve`)
* **Data Model yang Digunakan**: `Project`, `BOQItem`, `SCurveBaseline`, `ProgressItem`.
* **Alur Logika**:
  1. **Engineering** mengunggah / menginput *Bill of Quantities (BoQ)* dan *Baseline Schedule* (rencana progres mingguan 0-100%).
  2. **PJO (Site)** menginput *Actual Progress* setiap minggu beserta foto bukti lapangan.
  3. Sistem mengkalkulasi *Deviasi* = `Actual % - Baseline %`.
  4. Jika deviasi negatif (terlambat), indikator akan berwarna merah.
* **UI Components**:
  - `LineChart` (Recharts) dengan 2 garis: Rencana (Biru/Abu) dan Aktual (Hijau/Merah).
  - Tabel rincian progres per item pekerjaan.

### B. Dokumen Engineering & Workshop (`/documents` & `/workshop`)
* **Data Model yang Digunakan**: `Document`.
* **Alur Logika**:
  1. **Engineering** membuat Blueprint/Shop Drawing dan mengunggahnya dengan status `APPROVED_FOR_CONSTRUCTION`.
  2. **Workshop** menerima notifikasi/melihat daftar dokumen terbaru untuk mulai melakukan fabrikasi/pemotongan material.
  3. Menggunakan penyimpanan Cloud (atau integrasi upload lokal Next.js) untuk menyimpan file PDF/CAD.

---

## 2. Modul Logistik & Pembelian (Anti Mark-Up System)

Masalah utama yang ingin diselesaikan: manipulasi harga / *mark-up* oleh orang lapangan, serta alur pengadaan yang terputus.

### A. Material Request (MR) & Procurement (PO) (`/material-request` & `/procurement`)
* **Data Model**: `MaterialRequest`, `MRItem`, `PurchaseOrder`, `POItem`, `Vendor`.
* **Alur Logika**:
  1. **PJO** membuat MR dari *site* tambang. PJO hanya bisa *request* barang dan kuantitas (tanpa harga).
  2. **Logistik (Kantor Pusat)** menerima MR, mencari *Vendor*, dan menerbitkan **Purchase Order (PO)**.
  3. PO yang diterbitkan otomatis masuk ke modul **Keuangan** sebagai `PurchaseInvoice` (Hutang AP) saat barang dikirim.

### B. Pembelian Site & Anti Mark-up Control (`/site-purchase`)
* **Data Model**: `SitePurchase`, `PriceReference`, `PurchaseFlag`.
* **Alur Logika**:
  1. Untuk barang *urgent* yang harus dibeli langsung di sekitar tambang, **PJO** menginput `SitePurchase` beserta foto struk.
  2. Sistem otomatis membandingkan `unitPrice` yang diinput PJO dengan rata-rata harga di tabel `PriceReference` (Master Harga).
  3. > [!IMPORTANT]
     > **Sistem Deteksi**: Jika harga PJO > 10% di atas harga referensi, sistem otomatis membuat `PurchaseFlag` (Bendera Merah).
  4. Transaksi dengan bendera merah **tidak bisa di-reimburse (dibayar)** oleh Finance sebelum ada *Approval* khusus dari Top Management/HRD.

---

## 3. Modul HR & Payroll Automasi

Masalah utama: Sistem upah manual yang sering dimanipulasi orang lapangan.

### A. Kehadiran (Attendance) & Data Karyawan (`/employees` & `/attendance`)
* **Data Model**: `Employee`, `EmployeeProject`, `Attendance`.
* **Alur Logika**:
  1. **HRD** mendaftarkan `Employee` (Gaji Pokok, Tunjangan, BPJS).
  2. **PJO** melakukan absensi harian (`HADIR`, `LEMBUR`, `ALPA`). Absensi ini terkunci dan tidak bisa diubah lewat dari H+1.

### B. Payroll Automation & Approval berjenjang (`/payroll`)
* **Data Model**: `Payroll`, `PayrollItem`, `PayrollApproval`.
* **Alur Logika**:
  1. Akhir bulan, **HRD** menekan tombol *"Generate Payroll"*.
  2. Sistem otomatis menghitung: `(Gaji Pokok / 26 * Hari Hadir) + (Rate Lembur * Jam Lembur) - Potongan BPJS`.
  3. **Approval Tier 1**: HRD melakukan verifikasi dan *Approve*.
  4. **Approval Tier 2**: Top Management melakukan *Approve*.
  5. **Approval Tier 3**: Finance melakukan pembayaran.
  6. Setelah Finance membayar, sistem men- *trigger* pembuatan **JournalVoucher** di Buku Besar secara otomatis (Beban Gaji pada Kas).

---

## 4. Pengaturan Hak Akses (Role-Based Access Control / RBAC)

Sistem akan membatasi tampilan navigasi dan aksi (*Create/Edit/Delete/Approve*) berdasarkan *Role* akun:

| Role | Akses Utama |
|---|---|
| **TOP_MANAGEMENT** | Semua Dashboard, Approval Mark-up, Approval Payroll. (*Read-only* operasional). |
| **PJO (Site)** | S-Curve (Actual), Material Request, Site Purchase, Absensi Lapangan. |
| **LOGISTIK** | Menerima MR, Menerbitkan PO, Master Vendor, Master Harga Referensi. |
| **FINANCE** | Pembayaran PO, Jurnal Buku Besar, Pembayaran Payroll. |
| **HRD** | Data Karyawan, Verifikasi Absensi, Generate Payroll. |
| **ENGINEERING** | Upload Dokumen, Input BOQ dan Baseline S-Curve. |
| **WORKSHOP** | Melihat Blueprint, Update status fabrikasi. |

---

## 5. Rencana Eksekusi (Langkah Demi Langkah)

Jika Anda menyetujui *Master Plan* ini, saya akan mengeksekusi pembangunan dengan urutan prioritas berikut:

- [ ] **Langkah 1**: Membangun backend logika dan UI untuk **S-Curve & Progress** agar *Top Management* segera bisa memantau kesehatan proyek.
- [ ] **Langkah 2**: Membangun modul **Material Request, PO, dan Site Purchase (Anti-Markup)**.
- [ ] **Langkah 3**: Membangun modul **HR & Payroll** (Absensi & Kalkulasi Gaji Otomatis).
- [ ] **Langkah 4**: Membangun **RBAC** & Integrasi menyeluruh (Auto-Journal ke Buku Besar).

## User Review Required

Silakan periksa rencana di atas. 
1. Apakah alur **Anti Mark-up (Site Purchase)** sudah sesuai dengan harapan Anda? (Toleransi default diset 10%).
2. Apakah urutan eksekusi (*Langkah 1 sampai 4*) sudah sesuai dengan prioritas perusahaan saat ini?

Pilih tombol **Proceed** jika Anda ingin saya mulai memprogram **Langkah 1 (S-Curve & Progress)** sekarang.
