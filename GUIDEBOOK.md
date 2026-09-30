# 📚 Buku Panduan Pengguna (User Guidebook) - ERP Prohaba

Selamat datang di sistem **ERP Prohaba**! Sistem ini dirancang khusus untuk mempermudah manajemen proyek konstruksi, perencanaan kurva-S (S-Curve), serta pengelolaan administrasi internal (HR & Payroll). Panduan ini disusun untuk membantu seluruh level pengguna dalam memahami dan mengoperasikan sistem dengan optimal.

---

## 📑 Daftar Isi
1. [Pengenalan Sistem](#1-pengenalan-sistem)
2. [Modul S-Curve & BOQ (Bill of Quantities)](#2-modul-s-curve--boq)
3. [Modul HR & Payroll](#3-modul-hr--payroll)
4. [Modul Dokumen](#4-modul-dokumen)
5. [Tips & Trik Penggunaan](#5-tips--trik-penggunaan)

---

## 1. Pengenalan Sistem
Sistem ERP Prohaba adalah aplikasi berbasis web cerdas yang mengotomatisasi proses bisnis. Sistem ini mengedepankan desain yang minimalis, modern, dan sangat interaktif (berbasis *Apple-style minimalism*).

### Konsep Dasar Antarmuka:
- **Navigasi Kiri (Sidebar):** Tempat untuk berpindah antar modul (Proyek, S-Curve, HR, dll).
- **Pop-up / Modal:** Setiap interaksi penting (seperti tambah data, hapus, atau peringatan) akan muncul dalam bentuk *pop-up* di tengah layar.
- **Penyimpanan Otomatis:** Beberapa perubahan (seperti menggeser jadwal) langsung disimpan atau akan meminta konfirmasi instan.

---

## 2. Modul S-Curve & BOQ
Modul S-Curve adalah inti dari perencanaan proyek di sistem ini. Modul ini digunakan untuk merencanakan Rencana Anggaran Biaya (RAB) atau *Bill of Quantities* (BOQ) dan membuat kurva jadwal pelaksanaan.

### A. Upload Data BOQ via Excel
Bagi pengguna yang sudah memiliki data BOQ di Excel, sistem ini menyediakan fitur *smart upload*.
1. Masuk ke halaman **S-Curve**.
2. Klik tombol **Upload BOQ**.
3. Pilih *file* `.xlsx` yang sesuai dengan format standar (terdapat kolom Uraian Pekerjaan, Harga, dll).
4. Sistem akan secara otomatis **membaca hierarki penomoran** Anda.
   - *Contoh: Teks yang menggunakan huruf (A, B) atau angka tunggal (1) akan diatur sebagai **Grup Pekerjaan (Tebal, rata kiri, tanpa kalender)**. Angka bertitik (1.1, 1.2) akan menjadi **Sub-pekerjaan (Menjorok ke dalam, memiliki kalender)**.*

### B. Menambah Item BOQ Secara Manual
Jika ada item yang terlewat atau perlu ditambah di luar Excel:
1. Klik tombol **Tambah Item**.
2. Masukkan **Kode** (Misal: `A`, `1`, `1.1`), **Uraian Pekerjaan**, dan **Harga Total**.
3. Klik **Tambahkan** (atau cukup tekan *Enter* pada *keyboard*).
4. 💡 **Penting:** Sistem akan membaca kode Anda secara cerdas! 
   - Jika Anda mengetik `A` (tanpa titik), item akan dijadikan judul/grup besar (Otomatis sejajar ke kiri).
   - Jika Anda mengetik `1.1` (pakai titik), item otomatis dibuat menjorok ke dalam dan memiliki kalender jadwal.

### C. Mengedit & Merapikan Urutan (Auto-Sorting)
1. Klik ikon **Pensil (Edit)** di baris item yang ingin diubah.
2. Ubah data yang diperlukan, lalu tekan **Simpan**.
3. **Fitur Cerdas:** Apabila tabel terlihat berantakan karena Anda baru saja menambah item yang posisinya berada paling bawah, Anda cukup klik **Edit -> Simpan** pada item apa saja (tanpa perlu mengubah teksnya). Tabel otomatis akan menyusun ulang dan merapikan posisinya secara urut abjad dan numerik ke posisi hierarki yang benar!

### D. Mengatur Jadwal (Bulan Mulai & Bulan Selesai)
1. Pada setiap sub-pekerjaan (Level 2 ke bawah), terdapat input **Bulan Mulai** dan **Bulan Selesai**.
2. Klik pada kolom tersebut dan pilih bulan/tahun dari kalender yang muncul.
3. Setelah seluruh jadwal terisi, sistem akan menggunakan bobot harga masing-masing item untuk membentuk garis **Kurva-S** secara akurat.

---

## 3. Modul HR & Payroll
Modul ini menangani urusan sumber daya manusia dan penggajian pegawai, agar sinkron dengan pengeluaran proyek.

### HR (Human Resources)
- Digunakan untuk melihat daftar pegawai, posisi, status, dan riwayat pekerjaan.
- Menampilkan metrik performa pegawai dengan *dashboard* mini.

### Payroll (Penggajian)
- Digunakan untuk menghitung dan mencetak slip gaji.
- Menggunakan proses seleksi data yang teliti untuk mencegah kesalahan transfer atau salah hitung gaji pegawai.

---

## 4. Modul Dokumen
Pusat penyimpanan *file* (arsip digital) terkait proyek maupun perusahaan.
- Setiap dokumen dilabeli untuk kemudahan pencarian (Kontrak, Invoice, Gambar Kerja, dll).
- Folder tersusun layaknya *File Explorer* modern dengan fitur pratinjau yang responsif.

---

## 5. Tips & Trik Penggunaan
- **Tekan "Enter" pada Keyboard:** Saat pop-up peringatan (contoh: "Item berhasil diperbarui") muncul di layar, Anda tidak perlu repot-repot menggeser *mouse* untuk mengklik tombol "Mengerti". Anda bisa langsung menekan tombol `Enter` pada *keyboard* untuk menutupnya dengan super cepat!
- **Refresh Halaman (F5):** Jika Anda merasa urutan data di layar belum sinkron dengan kondisi terbaru, *refresh* halaman adalah cara tercepat untuk menyelaraskan ulang seluruh antarmuka dengan *database* pusat.
- **Hierarki Otomatis:** Saat mengetikkan kode pada BOQ (misal `1.2.1`), jangan beri karakter unik/aneh di dalam kodenya. Pastikan cukup menggunakan huruf dan angka berformat desimal agar sistem bisa memposisikan baris tersebut ke level indentasi secara akurat.

---
*Buku panduan ini bersifat dinamis dan akan terus diperbarui seiring dengan penambahan fitur-fitur mutakhir berikutnya di sistem ERP Prohaba.*
