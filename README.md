# Aplikasi Evaluasi Praktikum NDT (Magnetic & Penetrant Testing)

Aplikasi Web App berbasis **Google Apps Script (GAS)**, **Google Sheets**, dan **Google Drive** yang dirancang khusus untuk evaluasi digital praktikum NDT (Non-Destructive Testing) metode *Magnetic Particle Testing (MT)* dan *Liquid Penetrant Testing (PT)*.

---

## 🛠️ Fitur & Kepatuhan Terhadap PRD

1. **100% Google Apps Script (Zero-Cost Hosting)**:
   - Backend terintegrasi dengan Google Sheets sebagai Database dan Google Drive sebagai Media Storage.
2. **Autentikasi & Hak Akses Sesuai Peran**:
   - **Peserta**: Login **HANYA** menggunakan ID Peserta (tanpa PIN) untuk akses cepat praktikan di bengkel/lapangan.
   - **Penguji (Instruktur)**: Login dengan ID Penguji + PIN untuk keamanan ekstra.
3. **Modul 1: Form Universal (Mobile-First)**:
   - Header benda uji: Pemilihan metode (MT/PT), Test Piece ID, Dimensi Benda Uji (P & L mm), dan 1 Foto Keseluruhan.
   - Fitur Khusus Penguji: Checkbox *"Jadikan Kunci Jawaban (MASTER)"* & Checkbox *"Test Piece ZONK / Bersih"*.
4. **Engine Kanvas Sketsa (Single-Stroke Locking Mechanism)**:
   - Menggunakan template benda uji las NDT persis sesuai spesifikasi teknis (plat uji, kotak penanda run-on/run-off di pojok atas, garis las, sumbu tengah `- · - · -`, datum referensi **"Y"**, dan potongan melintang sambungan bevel V ganda).
   - Pengguna menggambar cacat dengan **1 tarikan garis**. Begitu jari/mouse dilepas, kanvas **langsung terkunci otomatis**.
   - Input dimensi untuk goresan tersebut: Panjang, Lebar, Jarak dari Kiri (**From Y**), Tipe, dan Keputusan (Accept/Reject).
   - **Auto-Numbering**: Sistem mengurutkan nomor indikasi secara otomatis berdasarkan nilai **From Y** terkecil ke terbesar (kiri ke kanan).
5. **Modul 2: Dashboard Komparasi & Evaluasi (Desktop-First)**:
   - Crosscheck Foto Keseluruhan Master vs Peserta (Side-by-Side).
   - Komparasi Tabel Dimensi Indikasi dijejerkan kiri dan kanan.
   - Komparasi Gambar Sketsa Indikasi dijejerkan berdampingan.
   - **Feedback Tanpa Angka**: Penguji memberikan umpan balik kualitatif pada kolom catatan perbaikan yang disediakan.
6. **Dashboard Riwayat Peserta**:
   - Indikator status otomatis: 🟡 Menunggu Evaluasi atau 🟢 Sudah Dievaluasi.
   - Tombol **[📋 Lihat Catatan]** memunculkan tampilan side-by-side dan umpan balik penguji.
7. **Manajemen Penyimpanan Drive Otomatis**:
   - Struktur folder: `[Root]` > `[Metode MT/PT]` > `[Test_Piece_ID]`.
   - Penamaan otomatis: `[TestPieceID]_[Nama/Master]_[Type].png`.

---

## 📂 Struktur File

- [`Code.gs`](file:///d:/Vibe%20Coding/Practical%204/Code.gs): Backend server script untuk Google Apps Script.
- [`Index.html`](file:///d:/Vibe%20Coding/Practical%204/Index.html): Template antarmuka HTML utama Web App GAS.
- [`Styles.html`](file:///d:/Vibe%20Coding/Practical%204/Styles.html): Desain CSS antarmuka modern responsif.
- [`Scripts.html`](file:///d:/Vibe%20Coding/Practical%204/Scripts.html): Logika JavaScript client-side (Single-Stroke Canvas & Komparasi).
- [`appsscript.json`](file:///d:/Vibe%20Coding/Practical%204/appsscript.json): Konfigurasi manifest Apps Script.
- [`index.html`](file:///d:/Vibe%20Coding/Practical%204/index.html): File pratinjau standalone yang dapat langsung dibuka di browser.
- [`PANDUAN_SETUP_GAS.md`](file:///d:/Vibe%20Coding/Practical%204/PANDUAN_SETUP_GAS.md): Panduan langkah demi langkah deployment ke Google Workspace.
