# Fase Pengerjaan - MT Sketch Review

Versi: 1.1 | Tanggal: 31 Oktober 2026

Acuan: [PRD_MAGNETIC_PRACTICAL_REPORT.md](PRD_MAGNETIC_PRACTICAL_REPORT.md).

Pilihan pengguna untuk rilis pertama: komparasi visual dan selisih data, kemudian penguji memberikan keputusan dan catatan. Tidak ada skor otomatis.

Tambahan versi 1.1: penomoran otomatis kiri ke kanan berdasarkan From Y ditegaskan pada fase 2. Upload satu foto test piece opsional masuk MVP pada fase 3 dan komparasi foto pada fase 4.

## 1. Ringkasan fase dan estimasi

Estimasi berikut adalah hari kerja untuk satu developer dengan akses ke akun Google target, referensi benda uji, dan penguji yang tersedia untuk mencoba hasil. Ini estimasi perencanaan, bukan janji tanggal selesai. Kondisi kode lama, autentikasi, serta hasil uji HP dapat mengubah estimasi.

| Fase | Fokus | Hasil yang dapat diperiksa | Estimasi | Dependensi |
|---|---|---|---:|---|
| 0 | Validasi kebutuhan dan pemeriksaan kode | Spesifikasi datum, alur akses, peta penggunaan ulang kode, daftar skenario uji | 1-2 hari | Referensi PDF dan akun target |
| 1 | Fondasi aplikasi dan data | Login/akses, role, sesi, benda uji, template dan struktur penyimpanan | 2-3 hari | Fase 0 |
| 2 | Editor sketch bersama | Gambar dari HP/laptop, beberapa goresan per indikasi, nomor otomatis kiri ke kanan, formulir dan draft | 3-4 hari | Fase 1 |
| 3 | Kunci dan pengumpulan laporan | Kunci berversi, penugasan, foto test piece opsional, submit terkunci, revisi dan pemulihan simpan | 4-5 hari | Fase 2 |
| 4 | Komparasi dan evaluasi | Foto dan sketch berdampingan, overlay sketch, pemasangan manual, selisih, hasil dan catatan | 3-4 hari | Fase 3 |
| 5 | Keluaran laporan dan operasional | Cetak/simpan PDF, CSV, backup, petunjuk penggunaan | 2-3 hari | Fase 4 |
| 6 | Uji kelas dan rilis | Hasil UAT, perbaikan, deployment terverifikasi, prosedur pemulihan | 2-3 hari | Fase 5 |
| Lanjutan | Pengembangan sesuai kebutuhan nyata | Fitur tambahan berdasarkan hasil pilot | Estimasi terpisah | Rilis pertama digunakan |

**MVP fungsional:** selesai fase 4, sekitar 13-18 hari kerja. **Rilis operasional:** selesai fase 6, sekitar 17-24 hari kerja atau kurang lebih 3-5 minggu kerja, di luar waktu tunggu keputusan dan akses. Estimasi fase 3 bertambah satu hari untuk upload, validasi, dan penyimpanan foto.

## 2. Fase 0 - Validasi kebutuhan dan pemeriksaan kode

Pekerjaan:

- Cocokkan geometri template dengan halaman PDF 3 dan contoh terisi halaman 5.
- Tetapkan arti datum Y, titik akhir pengukuran From Y, ukuran fisik benda uji, serta area yang boleh digambar.
- Pastikan satu indikasi mendukung beberapa goresan, termasuk star crack.
- Tetapkan akses peserta, identitas penguji, dan mode deployment yang bisa digunakan pada akun target.
- Buat rancangan layar HP dan komparasi laptop.
- Periksa kode dan file deployment yang sudah ada. Identifikasi fitur yang dapat digunakan ulang, perlu diubah, atau belum tersedia.
- Pilih satu sumber file antarmuka yang dikelola agar versi lokal dan versi Apps Script tidak berbeda tanpa sengaja.
- Siapkan data uji: tiga indikasi, satu indikasi bercabang, kasus kosong, salah tipe, salah keputusan, terlewat, dan tambahan.
- Tambahkan kasus indikasi dibuat dari kanan ke kiri, nilai From Y sama, serta foto dari kamera/galeri/laptop, tanpa foto, file rusak, dan upload gagal.

Hasil: catatan keputusan produk, rancangan layar, daftar pekerjaan terurut, dan data uji.

Kriteria selesai: instruktur dapat memahami dan mencoba alur gambar yang dirancang; definisi From Y konsisten; akses pengguna target berhasil dibuktikan pada percobaan teknis; seluruh file yang diperlukan untuk deployment teridentifikasi.

## 3. Fase 1 - Fondasi aplikasi dan data

Pekerjaan:

- Siapkan struktur Apps Script dan konfigurasi lingkungan pengembangan/pilot.
- Buat struktur Sheets dan folder Drive privat untuk data baru.
- Implementasikan autentikasi, sesi, pemeriksaan peran, dan pemeriksaan kepemilikan pada server.
- Implementasikan sesi training, daftar peserta, Test Piece ID, ukuran fisik, dan konfigurasi datum.
- Buat template pelat las dengan pita las horizontal, garis tengah, penanda atas, datum Y, dan penampang referensi.
- Definisikan ID permanen, versi template, model goresan, dan aturan validasi data.
- Definisikan metadata lampiran foto privat yang terikat pada versi kunci/revisi laporan; tetapkan batas upload sesuai PRD.
- Siapkan pencatatan kejadian penting dan penanganan kesalahan yang terlihat oleh pengguna.

Hasil: aplikasi dasar dengan akses dan penyimpanan nyata.

Kriteria selesai:

- Peserta hanya melihat tugas miliknya; penguji hanya melihat lingkup yang diizinkan.
- Mengganti role/ID pada request ditolak server.
- Template yang sama dapat ditampilkan pada HP dan laptop.
- Data kunci tidak muncul pada payload peserta.

## 4. Fase 2 - Editor sketch bersama

Pekerjaan:

- Implementasikan lapisan template terkunci dan lapisan goresan per indikasi.
- Implementasikan Add Indication, Selesai Menggambar, Gambar Lagi, Simpan, Batal, Edit, Undo/Redo, dan Hapus.
- Dukung beberapa goresan dalam satu objek dan tanda kecil untuk indikasi round.
- Hubungkan label nomor, bentuk sketch, dan kartu/tabel data.
- Tambahkan Length, Width, From Y, Round/Linear, Accept/Reject, dan Remark.
- Simpan koordinat relatif pelat; tambahkan zoom/pan tanpa mengubah geometri.
- Implementasikan validasi angka dan dukungan koma/titik desimal. Urutkan nomor otomatis berdasarkan From Y terkecil ke terbesar setiap tambah, edit From Y, dan hapus indikasi; nilai sama memakai urutan pembuatan tersimpan.
- Sinkronkan nomor 1 sampai N pada label sketch dan tabel; pertahankan ID permanen dan validasi urutan di server sebelum simpan final.
- Simpan draft server dan lokal bila browser mendukung, dengan indikator status yang jelas.
- Uji sentuhan HP nyata, stylus jika tersedia, mouse, perubahan orientasi, dan tampilan keyboard.

Hasil: satu editor yang digunakan untuk kunci maupun jawaban peserta.

Kriteria selesai:

- Bentuk bercabang tersimpan sebagai satu indikasi dengan satu baris data.
- Simpan dan muat ulang mempertahankan posisi, nilai, serta relasi gambar-data.
- Mengubah Length/Width/From Y tidak mengubah goresan diam-diam.
- Goresan tidak tercipta saat pengguna sedang melakukan navigasi/zoom.
- Nomor tampilan boleh berubah tanpa memutus relasi ID indikasi.
- Input From Y 80, 20, 50 mm menghasilkan nomor 1 = 20, 2 = 50, 3 = 80 pada sketch, tabel, dan setelah muat ulang. Edit/hapus tidak menyisakan nomor kosong; nilai sama tetap stabil.

## 5. Fase 3 - Kunci jawaban dan pengumpulan laporan

Pekerjaan:

- Implementasikan draft/publikasi kunci dan versi yang tidak dapat ditimpa setelah dipakai.
- Hubungkan penugasan dengan peserta, sesi, benda uji, template, dan versi kunci.
- Implementasikan pernyataan eksplisit Tidak ditemukan indikasi.
- Tambahkan slot satu foto test piece opsional pada kunci dan laporan, dengan pemilih file laptop, kamera/galeri HP, pratinjau, perbaikan orientasi, ganti, dan hapus pada draft.
- Implementasikan pemeriksaan format/ukuran di server, kompresi foto, penyimpanan Drive privat, serta status upload dan retry. Hubungkan foto ke versi/revisi yang benar.
- Tambahkan pratinjau laporan, kirim final, bukti kirim, dan penguncian jawaban.
- Tambahkan pembukaan revisi oleh penguji dengan alasan serta riwayat versi.
- Terapkan nomor revisi data, idempotency key, penguncian tulis singkat, dan status commit penyimpanan.
- Tangani jaringan putus, retry, respons terlambat, dan dua tab yang mengedit draft sama.

Hasil: alur instruktur membuat kunci sampai peserta mengirim laporan berjalan pada backend nyata.

Kriteria selesai:

- Kirim berulang menghasilkan satu kiriman untuk revisi yang sama.
- Submitted hanya muncul jika seluruh data wajib sudah tersimpan.
- Kunci baru tidak mengganti referensi laporan lama.
- Jawaban final tidak bisa diubah tanpa pembukaan revisi.
- Gangguan jaringan menampilkan status benar dan menyediakan retry tanpa kehilangan draft yang masih tersedia.
- Kunci/laporan tanpa foto tetap dapat dipublikasikan/dikirim. Foto yang dipilih harus tersimpan sebelum finalisasi atau dibatalkan eksplisit; kegagalan upload tidak menghapus sketch.
- Nomor indikasi dan foto pada versi final tetap sama walaupun versi/revisi baru dibuat.

## 6. Fase 4 - Komparasi dan evaluasi

Pekerjaan:

- Buat dashboard laptop dengan filter sesi, peserta, benda uji, dan status.
- Buat tampilan berdampingan dan overlay pada geometri template yang sama.
- Tampilkan foto kunci dan foto peserta berdampingan dengan tombol perbesar dan penanda Foto tidak dilampirkan. Foto kunci mengikuti izin publikasi kunci.
- Tambahkan transparansi, legenda, sorotan indikasi, dan navigasi yang konsisten.
- Buat pemasangan manual berdasarkan ID, dengan larangan pasangan ganda.
- Hitung selisih Length/Width/From Y dan tampilkan kecocokan tipe serta Accept/Reject.
- Tandai indikasi terlewat/tambahan serta kasus satu indikasi dilaporkan sebagai beberapa bagian.
- Tambahkan toleransi opsional sebagai penanda, tanpa skor atau hasil otomatis.
- Tambahkan draft evaluasi, hasil Sesuai/Perlu Perbaikan, catatan per indikasi, dan catatan umum.
- Pisahkan finalisasi evaluasi, publikasi feedback, dan pembukaan kunci untuk peserta.

Hasil: **MVP fungsional** yang mencakup seluruh alur utama pengguna.

Kriteria selesai:

- Urutan gambar peserta yang berbeda tidak menyebabkan pasangan otomatis yang salah.
- Selisih angka sesuai pasangan yang dipilih penguji.
- Kunci yang disembunyikan tetap tidak tersedia kepada peserta saat feedback dipublikasikan.
- Hasil akhir dapat ditelusuri ke laporan, versi kunci, penguji, dan waktu evaluasi.
- Foto kedua sisi sesuai versi yang diperiksa, dan foto kunci yang tersembunyi tidak tersedia pada payload peserta.

## 7. Fase 5 - Keluaran dan operasional

Pekerjaan:

- Buat tampilan cetak A4 yang mengikuti struktur header, tabel, dan sketch referensi.
- Sediakan cetak/simpan PDF dari browser laptop; pengarsipan PDF otomatis di server menjadi pekerjaan lanjutan.
- Pastikan tabel panjang berlanjut ke halaman berikutnya tanpa memotong nilai dan nomor indikasi.
- Sertakan foto jika tersedia dengan label dan rasio aspek yang benar; pastikan nomor indikasi di cetak/CSV sama dengan laporan tersimpan.
- Buat ekspor CSV sesuai filter dan izin penguji.
- Tambahkan pencadangan, dokumentasi pemulihan, serta kebijakan arsip/retensi yang dipilih lembaga.
- Buat panduan singkat peserta, instruktur, dan penguji.
- Periksa kelengkapan paket deployment dan perbedaan lingkungan pilot/produksi.

Hasil: laporan dapat digunakan dan diarsipkan di luar aplikasi; prosedur operasional tersedia.

Kriteria selesai: hasil cetak terbaca, data CSV cocok dengan layar, tidak ada kunci tersembunyi dalam ekspor peserta, dan backup dapat dipulihkan pada lingkungan salinan.

## 8. Fase 6 - Uji kelas dan rilis

Pekerjaan:

- Jalankan seluruh skenario penerimaan PRD memakai akun peserta dan penguji berbeda.
- Uji Chrome Android, Safari iPhone, dan browser laptop pada perangkat nyata.
- Lakukan pilot dengan target awal 20 peserta aktif dan 2 penguji.
- Ukur waktu buka/simpan, pengaruh autosave, error backend, dan perilaku ketika banyak peserta mengirim berdekatan.
- Uji ulang kasus akses ilegal, kunci tersembunyi, submit ganda, revisi, serta perubahan versi kunci.
- Uji nomor otomatis setelah tambah/edit/hapus, From Y sama, upload foto kamera/galeri, kompresi, orientasi, retry, serta akses foto yang dibatasi.
- Catat temuan, perbaiki masalah yang menghalangi alur, dan perbarui panduan.
- Siapkan rilis bernomor, backup sebelum rilis, dan langkah kembali ke versi sebelumnya.
- Verifikasi deployment memakai akun nyata setelah rilis.

Hasil: **rilis operasional** dengan catatan hasil uji dan panduan penggunaan.

Kriteria selesai: semua skenario kritis lulus, tidak ada kehilangan data atau kebocoran kunci pada pengujian, dan penguji dapat menyelesaikan satu siklus kelas tanpa bantuan developer.

## 9. Prioritas setelah rilis pertama

| Urutan usulan | Fitur | Alasan ditunda |
|---|---|---|
| 1 | Saran pasangan indikasi berdasarkan posisi dan From Y | Memerlukan contoh nyata untuk menguji kasus ambigu |
| 2 | Template tambahan dan upload referensi | Perlu aturan kalibrasi dan penyelarasan yang konsisten |
| 3 | Beberapa foto/detail per indikasi dan tanda tangan gambar | MVP sudah mencakup satu foto keseluruhan test piece; detail tambahan menambah alur input |
| 4 | Nilai angka berbobot | Memerlukan rubrik terpisah; pengguna memilih keputusan manual untuk MVP |
| 5 | Laporan MT lengkap, PT, dan integrasi LMS | Memperluas alur dan bidang data di luar kebutuhan awal |
| 6 | Offline penuh dan PDF otomatis di server | Membutuhkan mekanisme sinkronisasi/ekspor tambahan |

## 10. Tanggung jawab dan risiko jadwal

| Pihak | Tanggung jawab |
|---|---|
| Instruktur/pemilik kebutuhan | Tetapkan konvensi From Y, kunci contoh, istilah hasil evaluasi, dan kebijakan publikasi |
| Developer | Implementasi, validasi server, penyimpanan, editor, komparasi, dan pengujian teknis |
| Penguji pilot | Uji kemudahan kerja dan ketepatan komparasi dengan contoh laporan nyata |
| Pemilik akun Google/admin | Pastikan akses deployment, izin organisasi, folder penyimpanan, dan backup |

Risiko yang paling memengaruhi estimasi adalah penyesuaian autentikasi terhadap kebijakan akun Google, perubahan editor satu goresan menjadi beberapa goresan, kemungkinan data lama hanya menyimpan gambar datar, perbedaan sentuhan antarperangkat, serta kapasitas simpan saat kelas aktif. Foto/PNG lama dapat dipertahankan sebagai arsip, tetapi pemulihan goresan terpisah dari gambar lama tidak dianggap tersedia otomatis.

Setiap fase selesai dengan demonstrasi hasil dan pemeriksaan kriteria penerimaannya. Estimasi diperbarui berdasarkan temuan nyata sebelum melanjutkan pekerjaan yang bergantung padanya.
