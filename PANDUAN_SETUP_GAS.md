# 📘 PANDUAN LENGKAP SETUP & DEPLOYMENT
## Aplikasi Evaluasi Praktikum NDT (Magnetic & Penetrant Testing)

Dokumen ini berisi panduan tahap-demi-tahap untuk memasang dan menjalankan sistem evaluasi digital praktikum NDT berbasis **100% Google Apps Script (GAS) Web App**, **Google Sheets**, dan **Google Drive** tanpa biaya server (Zero Cost Hosting).

---

### 1. Arsitektur File Proyek

| Nama File | Fungsi Utama |
|---|---|
| `Code.gs` | Backend server GAS: Autentikasi, Folder hierarki Drive, Simpan Laporan, Auto-numbering, Evaluasi & Komparasi |
| `Index.html` | Struktur antarmuka HTML utama: Portal Login, Dashboard Peserta, Dashboard Penguji, Universal Form, Modal Single-Stroke Canvas & Modal Komparasi Side-by-Side |
| `Styles.html` | Design System CSS modern: Mobile-First responsif untuk input HP & Desktop-First untuk evaluasi komparasi |
| `Scripts.html` | Client-side JavaScript: Single-stroke canvas locking engine, auto-numbering by From Y, interaksi form, dan API bridge |
| `appsscript.json`| Manifest konfigurasi GAS, runtime V8, zona waktu Asia/Jakarta, dan hak akses OAuth Sheets & Drive |
| `index.html` | Versi **Standalone / Offline Preview**: Dapat langsung dibuka di browser untuk uji coba interaktif mandiri |

---

### 2. Langkah Deployment ke Google Workspace (Zero Cost)

#### Langkah 1: Buat Google Spreadsheet Baru
1. Buka [Google Sheets](https://sheets.new) di browser Anda.
2. Beri nama file Spreadsheet, misalnya: `Database_Praktikum_NDT`.

#### Langkah 2: Buka Apps Script Editor
1. Di menu Google Sheets, klik **Extensions** (Ekstensi) > **Apps Script**.
2. Beri nama project Apps Script, misalnya: `Sistem_Evaluasi_NDT_WebApp`.

#### Langkah 3: Salin File Kode
1. **File `Code.gs`**:
   - Buka file `Code.gs` bawaan di editor Apps Script.
   - Hapus semua isinya, lalu salin seluruh isi dari file [`Code.gs`](file:///d:/Vibe%20Coding/Practical%204/Code.gs).
2. **File `Index.html`**:
   - Di Apps Script, klik tombol **+** di panel kiri > pilih **HTML**.
   - Beri nama: `Index`.
   - Salin seluruh isi dari [`Index.html`](file:///d:/Vibe%20Coding/Practical%204/Index.html).
3. **File `Styles.html`**:
   - Klik tombol **+** > pilih **HTML**.
   - Beri nama: `Styles`.
   - Salin seluruh isi dari [`Styles.html`](file:///d:/Vibe%20Coding/Practical%204/Styles.html).
4. **File `Scripts.html`**:
   - Klik tombol **+** > pilih **HTML**.
   - Beri nama: `Scripts`.
   - Salin seluruh isi dari [`Scripts.html`](file:///d:/Vibe%20Coding/Practical%204/Scripts.html).
5. **Konfigurasi Manifest (`appsscript.json`)**:
   - Di menu sebelah kiri, klik **Project Settings** (ikon gerigi ⚙️).
   - Centang opsi: *"Show 'appsscript.json' manifest file in editor"*.
   - Kembali ke Editor (ikon `< >`), buka `appsscript.json`, dan ganti isinya dengan file [`appsscript.json`](file:///d:/Vibe%20Coding/Practical%204/appsscript.json).

---

### 3. Inisialisasi Database Google Sheets Otomatis

1. Di Apps Script Editor, pada dropdown fungsi di bagian atas, pilih fungsi: **`setupInitialDatabase`**.
2. Klik tombol **Run** (Jalankan).
3. Jika muncul pop-up izin akses (*Authorization Required*):
   - Klik **Review Permissions** > pilih akun Google Anda.
   - Klik **Advanced** > klik tautan *"Go to Sistem_Evaluasi_NDT_WebApp (unsafe)"*.
   - Klik **Allow**.
4. Periksa Google Spreadsheet Anda:
   - 3 Sheet utama akan otomatis dibuat lengkap dengan header warna industrial:
     - **`Master_Akun`**: Menyimpan akun Penguji dan Peserta.
     - **`Data_Header`**: Menyimpan data submisi benda uji, metode, dimensi, status zonk/master, dan status evaluasi.
     - **`Data_Detail`**: Menyimpan data tiap goresan indikasi (panjang, lebar, from Y, tipe, keputusan, link sketsa, dan catatan penguji).

---

### 4. Konfigurasi Penyimpanan Google Drive

1. Secara default, sistem akan otomatis membuat folder bernama **`NDT_Praktikum_Storage`** di Root Google Drive Anda jika `ROOT_FOLDER_ID` dibiarkan kosong.
2. Jika Anda ingin menyatukannya ke folder Google Drive tertentu yang sudah ada:
   - Buka folder tersebut di Google Drive, salin ID folder dari URL-nya (teks setelah `folders/...`).
   - Buka `Code.gs`, isi variabel:
     ```javascript
     var ROOT_FOLDER_ID = "MASUKKAN_ID_FOLDER_GOOGLE_DRIVE_DISINI";
     ```
3. **Hierarki Folder Otomatis**:
   - Folder Root > Nama Metode (`MAGNETIC_PARTICLE` / `PENETRANT_TESTING`) > Test Piece ID (`MTPT_02_B`).
   - Semua sketsa dan foto dari instruktur maupun mahasiswa untuk benda uji yang sama akan otomatis berkumpul di dalam satu folder tersebut.

---

### 5. Deploy Sebagai Web App (Publikasikan)

1. Di Apps Script Editor pojok kanan atas, klik tombol **Deploy** > **New deployment**.
2. Klik ikon gerigi di samping *Select type* > pilih **Web app**.
3. Atur konfigurasi:
   - **Description**: `Rilis V1 Sistem Evaluasi Praktikum NDT`
   - **Execute as**: **Me** (akun pemilik script)
   - **Who has access**: **Anyone** (siapa saja, agar mahasiswa di lapangan dapat mengakses form tanpa harus login akun Google instansi)
4. Klik tombol **Deploy**.
5. Salin URL Web App yang dihasilkan (format: `https://script.google.com/macros/s/.../exec`).
6. Bagikan URL ini kepada mahasiswa atau tempelkan pada QR Code di bengkel praktikum!

---

### 6. Panduan Penggunaan Sistem Sesuai PRD

#### A. Login Peserta (Praktikan di Lapangan)
- **Metode Login**: Cukup masukkan **ID Peserta** (misal: `MHS202401`) tanpa PIN untuk kemudahan dan kecepatan kerja di lapangan.
- **Form Universal (Mobile-First)**:
  1. Pilih Metode: *Magnetic Particle Testing* / *Penetrant Testing*.
  2. Masukkan *Test Piece ID* (misal: `MTPT 02 B`).
  3. Masukkan Dimensi Panjang & Lebar benda uji (mm).
  4. Ambil/Unggah 1 Foto acuan keseluruhan benda uji.
  5. Tekan tombol **[+ Tambah Indikasi]** untuk membuka kanvas Single-Stroke:
     - Tarik **1 goresan garis** pada letak cacat di area las spesimen.
     - Begitu jari/mouse dilepas, **kanvas otomatis terkunci**.
     - Lengkapi nilai Panjang, Lebar, dan Jarak dari Kiri (**From Y**).
     - Tekan **[Simpan Indikasi]**.
     - Sistem secara otomatis mengurutkan nomor indikasi (No. 1, 2, 3...) dari nilai **From Y** terkecil ke terbesar (kiri ke kanan).
  6. Tekan **[Kirim Laporan Praktikum]**.
  7. Pada dashboard peserta, status awal adalah **🟡 Menunggu Evaluasi**.

#### B. Portal Penguji / Instruktur (Desktop-First)
- **Metode Login**: Masukkan **ID Penguji** (contoh default: `INSTRUKTUR01`) + **PIN** (`1234`).
- **Membuat Kunci Jawaban (Master)**:
  - Buka formulir input, centang opsi: **"Jadikan Kunci Jawaban (MASTER)"**.
  - Jika spesimen bersih, centang **"Test Piece ZONK / Bersih"**.
  - Masukkan goresan indikasi standar sebagai kunci acuan.
- **Evaluasi Komparasi Visual Side-by-Side**:
  - Pada daftar submisi peserta, klik **[🔍 Evaluasi & Komparasi]**.
  - Layar komparasi menampilkan secara berdampingan:
    1. Crosscheck Foto Keseluruhan: Master di kiri vs Peserta di kanan.
    2. Komparasi Tabel Dimensi Indikasi (urut kiri ke kanan).
    3. Komparasi Gambar Sketsa Indikasi Master vs Peserta.
    4. **Catatan Perbaikan (Feedback)**: Penguji memberikan arahan/catatan kualitatif (tanpa nilai angka).
  - Klik **[💾 Simpan Evaluasi & Tandai Selesai]**.
- **Hasil di Sisi Peserta**:
  - Status berubah menjadi **🟢 Sudah Dievaluasi**.
  - Peserta dapat menekan tombol **[📋 Lihat Catatan]** untuk melihat hasil side-by-side dan membaca masukan instruktur.
