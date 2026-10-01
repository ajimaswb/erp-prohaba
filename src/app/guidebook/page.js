import React from 'react';

export const metadata = {
  title: 'Guidebook | ERP Prohaba',
};

export default function GuidebookPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', color: 'var(--gray-800)', lineHeight: '1.6' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--navy-800)', marginBottom: '16px' }}>
          📚 Buku Panduan Penggunaa
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--gray-600)' }}>
          Panduan lengkap penggunaan ERP Prohaba untuk seluruh tingkatan penggunaa.
        </p>
      </div>
	      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <a href="/" className="btn btn-outline">Kembali ke Beranda</a>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
        
        {/* Intro */}
        <section style={{ marginBottom: '40px' }}>
          <p>
            Selamat datang di sistem <strong>ERP Prohaba</strong>! Sistem ini dirancang khusus untuk mempermudah manajemen proyek konstruksi, perencanaan kurva-S (S-Curve), serta pengelolaan administrasi internal (HR & Payroll).
          </p>
        </section>

        {/* 1. Pengenalan Sistem */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy-700)', borderBottom: '2px solid var(--navy-100)', paddingBottom: '8px', marginBottom: '16px' }}>
            1. Pengenalan Sistem
          </h2>
          <p>Sistem ERP Prohaba adalah aplikasi berbasis web cerdas yang mengotomatisasi proses bisnis. Sistem ini mengedepankan desain yang minimalis, modern, dan sangat interaktif (berbasis <em>Apple-style minimalism</em>).</p>
          
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '16px', marginBottom: '12px' }}>Konsep Dasar Antarmuka:</h3>
          <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><strong>Navigasi Kiri (Sidebar):</strong> Tempat untuk berpindah antar modul (Proyek, S-Curve, HR, dll).</li>
            <li><strong>Pop-up / Modal:</strong> Setiap interaksi penting (seperti tambah data, hapus, atau peringatan) akan muncul dalam bentuk <em>pop-up</em> di tengah larar.</li>
            <li><strong>Penyimpanan Otomatis:</strong> Beberapa perubahan (seperti menggeser jadwal) langsung disimpan atau akan meminta konfirmasi instan.</li>
          </ul>
        </section>

        {/* 2. Modul S-Curve */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy-700)', borderBottom: '2px solid var(--navy-100)', paddingBottom: '8px', marginBottom: '16px' }}>
            2. Modul S-Curve & BOQ
          </h2>
          <p>Modul S-Curve adalah inti dari perencanaan proyek di sistem ini. Modul ini digunakan untuk merencanakan Rencana Anggaran Biaya (RAB) atau <em>Bill of Quantities</em> (BOQ) dan membuat kurva jadwal pelaksanaan.</p>
          
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '24px', marginBottom: '12px', color: 'var(--navy-600)' }}>A. Upload Data BOQ via Excel</h3>
          <p>Bagi pengguna yang sudah memiliki data BOQ di Excel, sistem ini menyediakan fitur <em>smart upload</em>.</p>
          <ol style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <li>Masuk ke halaman <strong>S-Curve</strong>.</li>
            <li>Klik tombol <strong>Upload BOQ</strong>.</li>
            <li>Pilih file <code>.xlsx</code> yang sesuai dengan format standar (terdapat kolom Uraian Pekerjaan, Harga, dll).</li>
            <li>Sistem akan secara otomatis <strong>membaca hierarki penomoran</strong> Anda.
              <ul style={{ paddingLeft: '20px', marginTop: '8px', listStyleType: 'circle', color: 'var(--gray-600)' }}>
                <li><em>Contoh: Teks yang menggunakan huruf (A, B) atau angka tunggal (1) akan diatur sebagai <strong>Grup Pekerjaan</strong> (Tebal, rata kiri, tanpa kalender).</em></li>
                <li><em>Contoh: Angka bertitik (1.1, 1.2) akan menjadi <strong>Sub-pekerjaan</strong> (Menjorok ke dalam, memiliki kalender).</em></li>
              </ul>
            </li>
          </ol>

          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '24px', marginBottom: '12px', color: 'var(--navy-600)' }}>B. Menambah Item BOQ Secara Manual</h3>
          <p>Jika ada item yang terlewat atau perlu ditambah di luar Excel:</p>
          <ol style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <li>Klik tombol <strong>Tambah Item</strong>.</li>
            <li>Masukkan <strong>Kode</strong> (Misal: <code>A</code>, <code>1</code>, <code>1.1</code>), <strong>Uraian Pekerjaan</strong>, dan <strong>Harga Total</strong>.</li>
            <li>Klik <strong>Tambahkan</strong> (atau cukup tekan <em>Enter</em> pada keyboard).</li>
            <li>
              <div style={{ background: 'var(--orange-50)', borderLeft: '4px solid var(--orange-400)', padding: '12px 16px', borderRadius: '4px', marginTop: '8px' }}>
                <strong style={{ color: 'var(--orange-800)' }}>�Penting: Sistem akan membaca kode Anda secara cerdas!</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px', color: 'var(--orange-900)' }}>
                  <li>Jika Anda mengetik <code>A</code> (tanpa titik), item akan dijadikan judul/grup besar (Otomatis sejajar ke kiri).</li>
                  <li>Jika Anda mengetik <code>1.1</code> (pakai titik), item otomatis dibuat menjorok ke dalam dan memiliki kalender jadwal.</li>
                </ul>
              </div>
            </li>
          </ol>

          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '24px', marginBottom: '12px', color: 'var(--navy-600)' }}>C. Mengedit & Merapikan Urutan (Auto-Sorting)</h3>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Klik ikon <strong>Pensil (Edit)</strong> di baris item yang ingin diubah.</li>
            <li>Ubah data yang diperlukan, lalu tekan <strong>Simpan</strong>.</li>
            <li><strong>Fitur Cerdas:</strong> Apabila tabel terlihat berantakan karena Anda baru saja menambah item yang posisinya berada paling bawah, Anda cukup klik <strong>Edit -&gt; Simpan</strong> pada item apa saja (tanpa perlu mengubah teksnya). Tabel otomatis akan menyusun ulang dan merapikan posisinya secara urut abjad dan numerik ke posisi hierarki yang benar!</li>
          </ol>

          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '24px', marginBottom: '12px', color: 'var(--navy-600)' }}>D. Mengatur Jadwal (Bulan Mulai & Bulan Selesai)</h3>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Pada setiap sub-pekerjaan (Level 2 ke bawah), terdapat input <strong>Bulan Mulai</strong> dan <strong>Bulan Selesai</strong>.</li>
            <li>Klik pada kolom tersebut dan pilih bulan/tahun dari kalender yang muncul.</li>
            <li>Setelah seluruh jadwal terisi, sistem akan menggunakan bobot harga masing-masing item untuk membentuk garis <strong>Kurva-S</strong> secara akurat.</li>
          </ol>
        </section>

        {/* 3. Modul HR */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy-700)', borderBottom: '2px solid var(--navy-100)', paddingBottom: '8px', marginBottom: '16px' }}>
            3. Modul HR & Payroll
          </h2>
          <p>Modul ini menangani urusan sumber daya manusia dan penggajian pegawai, agar sinkron dengan pengeluaran proyek.</p>
          
          <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><strong>HR (Human Resources):</strong> Digunakan untuk melihat daftar pegawai, posisi, status, riwayat pekerjaan, dan metrik performa pegawai.</li>
            <li><strong>Payroll (Penggajian):</strong> Digunakan untuk menghitung dan mencetak slip gaji. Menggunakan proses seleksi data yang teliti untuk mencegah kesalahan transfer atau salah hitung gaji pegawai.</li>
          </ul>
        </section>

        {/* 4. Modul Dokumen */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy-700)', borderBottom: '2px solid var(--navy-100)', paddingBottom: '8px', marginBottom: '16px' }}>
            4. Modul Dokumen
          </h2>
          <p>Pusat penyimpanan file (arsip digital) terkait proyek maupun perusahaan.</p>
          <ul style={{ paddingLeft: '24px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Setiap dokumen dilabeli untuk Kemudahan pencarian (Kontrak, Invoice, Gambar Kerja, dll).</li>
            <li>Folder tersusun layaknya <em>File Explorer</em> modern dengan fitur pratinjau yang responsif.</li>
          </ul>
        </section>

        {/* 5. Tips & Trik */}
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--navy-700)', borderBottom: '2px solid var(--navy-100)', paddingBottom: '8px', marginBottom: '16px' }}>
            5. Tips & Trik Penggunaan
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'var(--navy-50)', borderRadius: '12px', border: '1px solid var(--navy-100)' }}>
              <strong style={{ color: 'var(--navy-800)', fontSize: '16px' }}>🎯 Tekan "Enter" pada Keyboard</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>Saat pop-up peringatan (contoh: "Item berhasil diperbarui") muncul di layar, Anda tidak perlu repot-repot menggeser mouse untuk mengklik tombol "Mengerti". Anda bisa langsung menekan tombol <code>Enter</code> pada keyboard untuk menutupnya dengan super cepat!</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--navy-50)', borderRadius: '12px', border: '1px solid var(--navy-100)' }}>
              <strong style={{ color: 'var(--navy-800)', fontSize: '16px' }}>🔄 Refresh Halaman (F5)</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>Jika Anda merasa urutan data di larar belum sinkron dengan kondisi terbaru, refresh halaman adalah cara tercepat untuk menyelaraskan ulang seluruh antarmuka dengan database pusat.</p>
            </div>
            <div style={{ padding: '16px', background: 'var(--navy-50)', borderRadius: '12px', border: '1px solid var(--navy-100)' }}>
              <strong style={{ color: 'var(--navy-800)', fontSize: '16px' }}>🔢 Hierarki Otomatis</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>Saat mengetikkan kode pada BOQ (misal <code>1.2.1</code>), jangan beri karakter unik/aneh di dalam kodenya. Pastikan cukup menggunakan huruf dan angka berformat desimal agar sistem bisa memposisikan baris tersebut ke level indentasi secara akurat.</p>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: '60px', textAlign: 'center', color: 'var(--gray-400)', fontSize: '14px' }}>
          <p>Buku panduan ini bersifat dinamis dan akan terus diperbarui seiring dengan penambahan fitur-fitur mutakhir berikutnya di sistem ERP Prohaba.</p>
        </footer>
      </div>
    </div>
  );
}
