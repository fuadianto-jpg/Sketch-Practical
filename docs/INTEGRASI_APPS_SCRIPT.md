# Integrasi MT Sketch Review

UI baru di `Index.html` terhubung ke endpoint `mtApi` dalam `Code.gs` melalui `google.script.run`. UI harus dibuka dari URL deployment Apps Script. Prototipe di chat tetap simulasi terpisah.

## Persiapan akun

Sejak versi 25, akses utama memakai dua tab atas **Peserta / Penguji**. Peserta langsung mengisi laporan. Tab **Penguji** membuka pop-up dengan satu field password; masukkan **4321**, sesuai ketentuan pengguna. Password diperiksa di server dan tidak berada pada sumber HTML. Identitas penguji pada evaluasi menggunakan akun bersama **SHARED_REVIEWER / Penguji**, bukan identitas individu. Menu penguji menyediakan **Kunci jawaban** dan **Pemeriksaan**. Kembali ke Peserta mengakhiri sesi penguji dan memulihkan draft peserta sebelumnya. Pengaturan Master_Akun di bawah adalah dukungan akun lama, bukan syarat login melalui pop-up ini.

Database memakai spreadsheet yang sudah dikonfigurasi di proyek. Sheet lama `Data_Header` dan `Data_Detail` dipertahankan. Integrasi baru menulis indeks ke **MT_Records** dan dokumen sketch/foto ke folder Drive privat **MT_Sketch_Private**. Folder ini dibuat otomatis pada penyimpanan pertama.

Peserta langsung membuka halaman laporan tanpa login. Kolom **Nama peserta** wajib diisi sebelum simpan atau kirim. Nama tersimpan pada dokumen dan kolom **Nama** di MT_Records, lalu tampil pada daftar penguji. Nama adalah identitas yang diisi sendiri, bukan akun terverifikasi. Sesi peserta dibedakan dengan token acak; kesamaan nama tidak memberikan akses ke laporan lain. Cache sesi berlaku sekitar 6 jam dan sejak versi 26 dapat diperbarui dengan kunci pemulihan privat di browser yang sama. Laporan tetap tersedia bagi penguji walaupun akses pemulihan peserta hilang.

Untuk akun lama, admin menyiapkan akun di sheet **Master_Akun**, dengan kolom **Role, ID_Pengguna, PIN, Nama**, role `Penguji` dan ID unik. Format PIN sebagai **Plain text**, lalu isi kode akses minimal 6 karakter. Akun lama tetap didukung oleh backend. Pop-up utama versi 25 menggunakan password tetap di atas dan tidak meminta ID pengguna atau membaca PIN dari sheet tersebut.

Pada login pertama yang berhasil, server mengubah nilai PIN menjadi hash bersalt. Pengguna tetap masuk dengan kode semula. Admin dapat mereset akses dengan mengisi kode baru di kolom PIN dan menyampaikannya langsung kepada pemilik akun. Tidak ada akun atau password default yang dibuat otomatis.

Jika sheet belum tersedia, pemilik proyek menjalankan **mtSetup_** dari editor Apps Script, lalu mengisi akun. Sesi akses maksimal sekitar satu jam dan bisa berakhir lebih awal bila cache platform dihapus.

## Alur penggunaan

Sejak versi 52 (perbaikan layout versi 51), HP dapat menggeser kiri/kanan untuk berpindah **Examination → Master Key → Batch**. Login penguji baru membuka Examination; refresh tetap memulihkan bagian terakhir. Tombol tab tetap bisa diketuk. Geser di area tab atau area halaman noninteraktif; input, tabel, gambar sketch, editor key dan pop-up tidak menjalankan perpindahan. Scroll atas/bawah tetap berjalan. Isian form batch dipertahankan saat berganti tab.

Sejak versi 50, Master Key menggabungkan side A/B dalam satu baris nomor dasar, misalnya MT PT 133. **Edit** membuka matriks **A–MT, A–PT, B–MT, B–PT**. Pilih aksi key pada sel yang sesuai. Untuk mengubah kode/keterangan atau menghapus side, buka **Edit data Test Piece** di dalam modal. Kode side asli tetap dipakai peserta/sketch/laporan; pengelompokan hanya merapikan tampilan.

Sejak versi 49, menu penguji **Examination** adalah nama baru Pemeriksaan. Halaman **Master Key** menampilkan semua Test Piece tanpa kolom cari/filter metode/status. Klik **Add Test piece** untuk membuka pop-up ID/keterangan dan menambahkan Test Piece. Edit Test Piece tetap menyediakan status dan pengelolaan master key MT/PT.

Sejak versi 48, penguji menggunakan tiga menu: **Pemeriksaan**, **Master Key**, dan **Batch**. Menu Laporan peserta yang terpisah dihapus; gunakan daftar dan tombol Edit di Pemeriksaan. Master Key adalah nama baru Test Piece & Master Key, dengan fungsi pengelolaan yang sama.

Sejak versi 47, refresh pada tab yang sama memulihkan sesi Penguji yang masih berlaku setelah memvalidasi token di server. Password tidak disimpan; bagian/filter serta record tersimpan terakhir dapat dipulihkan. Sesi penguji sekitar 1 jam dan dapat berakhir lebih awal bila cache server dihapus. Pilih **Peserta** untuk keluar dari sesi penguji. Setelah sesi berakhir, tutup tab/data browser hilang, atau keluar, masuk kembali dengan password. Perubahan key/pemeriksaan yang belum disimpan perlu disimpan sebelum refresh.

Sejak versi 46, isi dimensi melalui **Sketch → Add Dimension → panjang/lebar/tebal → Terapkan dimensi**. Ukuran tampil sebagai ringkasan; gunakan **Edit Dimension** untuk mengganti. **Batal/Tutup** tidak menerapkan perubahan. Sebelum dimensi diterapkan, Add Indication membuka popup dimensi. Setelah itu ukuran ikut disimpan saat Simpan draft/Kirim. Sejak versi 45, kode Test Piece terpilih otomatis muncul dalam sketch dan PNG di bagian atas pelat.

Sejak versi 44, tulisan penanda wajib tidak ditampilkan. Nama, batch, metode dan ukuran tetap divalidasi saat menyimpan/mengirim. Menu Sampah dan Pulihkan sudah dihapus. Gunakan **Edit → Hapus → Ya, hapus permanen**; data tidak dapat dipulihkan melalui aplikasi. Acuan kunci pada laporan yang sudah terikat tetap tersedia untuk pemeriksaan historis, tanpa mengembalikan kunci tersebut ke daftar aktif. Penjelasan Sampah pada riwayat versi di bawah sudah tidak berlaku.

Sejak versi 43, daftar Test Piece menyembunyikan panel status key MT/PT. Buka **Edit Test Piece → Master key** untuk melihat status dan menjalankan semua aksi key. Filter metode/status pada daftar tetap dapat digunakan.

Sejak versi 42, tombol pembuatan/pengelolaan master key berada di **Penguji → Test Piece & Master Key → Edit Test Piece → Master key**. Daftar utama hanya memperlihatkan status MT dan PT. Pilih **Buat master key** di dalam Edit pada metode yang dibutuhkan; jika sudah ada, tersedia aksi lanjut draft, lihat/revisi, dan riwayat. Simpan perubahan kode/keterangan sebelum berpindah ke pengelolaan master key.

Sejak versi 41, buka **Penguji → Test Piece & Master Key**. Tiap Test Piece memperlihatkan panel **MT** dan **PT** dengan status **Belum ada key**, **Draft · belum submit**, atau **Sudah submit key**. Pilih **Buat master key** pada metode yang dibutuhkan; Test Piece/metode otomatis terisi di editor. Setelah lengkap tekan **Terbitkan kunci** untuk memperbarui statusnya. Draft belum dianggap key yang disubmit.

Gunakan **Lanjut draft** untuk melengkapi draft, **Lihat key** untuk melihat key terbit, **Edit / Revisi** untuk perubahan, dan **Detail / Riwayat** untuk semua versi pada metode/Test Piece tersebut. Jika ada key terbit dan draft revisi, key terbit tetap aktif sampai revisi diterbitkan. Sampah key/Test Piece dapat diakses dari halaman ini. Tidak ada perubahan pada kunci yang sudah terikat laporan lama.

Sejak versi 40, **Daftar kunci jawaban** menampilkan informasi ringkas; buka **Detail** untuk ID, pembuat, revisi, waktu dan tombol melihat sketch. **Edit → Edit sketch dan indikasi** membuka draft milik sendiri atau membuat draft revisi dari kunci terbit/kunci penguji lain. Setelah diperbaiki, simpan/terbitkan melalui editor. **Edit → Hapus → Ya, pindahkan ke Sampah** menyembunyikan kunci dari acuan baru. Untuk mengembalikan, buka **Sampah → Lihat / Pulihkan → Pulihkan**. Laporan yang sudah terikat pada kunci tetap dapat diperiksa.

Sejak versi 36, **Penguji → Kunci jawaban** langsung membuka **Daftar kunci jawaban**. Gunakan filter Metode, Test Piece, dan Status, lalu **Buka** pada kunci yang ingin diperiksa. Kunci terbit terbaru per metode/Test Piece diberi label **Acuan terbaru**. **Buat kunci baru** membuka editor baru, sedangkan **Daftar kunci** pada editor kembali ke daftar. Edit draft/revisi mengikuti kepemilikan kunci yang sudah berlaku; daftar ini tidak mengubah hak akses atau kunci laporan lama.

Sejak versi 35, **Penguji → Laporan peserta / Test Piece / Batch** menyediakan **Edit**. Pada form edit, gunakan **Simpan perubahan** atau **Hapus → Ya, pindahkan ke Sampah**. Untuk mengembalikan data, buka **Sampah → Lihat / Pulihkan → Pulihkan**. Data tidak dihapus permanen.

Edit data laporan meliputi nama, batch, metode dan Test Piece. Mengubah metode/Test Piece mengosongkan hasil evaluasi sebelumnya untuk diperiksa ulang. Sketch, indikasi, foto dan pemilik laporan dipertahankan. Kode Test Piece/batch yang sudah dipakai laporan tidak dapat diganti; nama/keterangan tetap bisa diubah. Katalog yang dihapus tidak muncul untuk pilihan baru, sementara laporan historis tetap tersedia. Entri yang dihapus harus dipulihkan sebelum dipakai kembali.

Sejak versi 31, penguji mengisi database melalui **Penguji → Batch → Tambah batch** (kode dan nama opsional). Sheet **MT_Batches** dibuat otomatis; isinya awalnya kosong. Peserta memilih **Batch** pada tab Data sebelum menyimpan/mengirim. Jika batch belum tampil, tekan **Perbarui daftar**. Batch ikut disimpan dalam laporan, draft pemulihan, dan PNG.

Untuk memeriksa satu kelompok, buka **Penguji → Pemeriksaan → Filter batch pemeriksaan**, pilih batch, lalu pilih laporan. Daftar berisi laporan terkirim/ditinjau dari batch yang dipilih. **Semua batch** menampilkan seluruh kelompok; **Tanpa batch (laporan lama)** menampilkan laporan sebelum fitur ini. Mengubah filter menutup laporan yang sedang terbuka. Kunci jawaban tetap dapat digunakan lintas batch berdasarkan metode dan Test Piece yang sama.

Sejak versi 30, tab **Sketch → Dimensi test piece** menyediakan panjang (arah From Y), lebar, dan tebal dalam mm. Isi angka (maksimal dua desimal) lalu tekan **Terapkan dimensi**, kemudian **Simpan draft** atau **Kirim laporan** untuk menyimpan ke server. From Y maksimal sepanjang test piece. Sketch bersifat skematis dengan label dimensi; laporan lama memakai 200 × 200 × 5 mm. Dimensi ikut ditampilkan pada PNG dan pemeriksaan.

Setelah upload foto, gunakan **↶ 90° / ↷ 90°** untuk memutar kiri/kanan. Hasil putaran ikut disimpan saat Simpan draft/Kirim, dan dipulihkan dalam draft lokal. Foto laporan final hanya bisa diubah melalui revisi.

Sejak versi 29, peserta tidak lagi melihat dropdown/tombol **Buka laporan tersimpan**. Penguji tetap dapat memilih laporan pada menu pemeriksaan. Setelah peserta berhasil mengirim, tab **Kirim** menampilkan **Simpan gambar (PNG)**. Tombol membuka pratinjau berisi nama, metode, Test Piece, ID/waktu kirim, sketch bernomor, dan tabel seluruh indikasi. Gunakan **Unduh PNG**, **Bagikan gambar** bila didukung HP, atau tekan lama pratinjau untuk menyimpan. Foto benda uji tidak dimasukkan ke gambar ini; fokusnya sketch dan indikasi. Gambar dibuat di browser tanpa meminta izin screenshot layar atau mengunggahnya ke layanan lain. Laporan tetap tersimpan untuk penguji.

Sejak versi 27, judul aplikasi paling atas adalah **Practical Report (Sketch)**. Pada tab Data, peserta mengisi **Nama**, memilih **Magnetic Particle Testing** atau **Penetrant Testing**, kemudian memilih **Test Piece** dari database. Metode dinonaktifkan sebelum nama terisi; Test Piece dinonaktifkan sebelum metode dipilih. Mengganti metode mengosongkan pilihan Test Piece. Metode tersimpan bersama laporan dan dipulihkan setelah refresh. Komparasi dan evaluasi hanya menggunakan kunci dengan Test Piece dan metode yang sama. Data historis yang belum memiliki metode dibaca sebagai Magnetic Particle Testing.

Sejak versi 26, **Test Piece ID** berupa dropdown dari sheet **MT_TestPieces**. Saat database pertama dibuat, kode benda uji diimpor dari MT_Records; jika belum ada data, dibuat kode awal MTPT 02 B. Penguji dapat menambah ID dan keterangan melalui **Penguji → Test Piece → Tambah Test Piece**. Duplikat ditolak dan peserta tidak dapat menambah kode sendiri. Simpan laporan divalidasi terhadap daftar database ini.

Riwayat peserta menggunakan kunci pemulihan acak di localStorage browser, dengan hash kunci dan ID peserta di sheet privat **MT_Participants**. Sesi cache dapat diperbarui menggunakan kunci ini, sehingga riwayat tetap dapat dibuka setelah sesi sementara habis atau tab baru dibuka pada browser yang sama. Nama yang sama tidak memberikan akses ke riwayat orang lain. Penghapusan data browser/perangkat berbeda tidak dapat memulihkan akses hanya berdasarkan nama; penguji tetap dapat membuka laporan lama.

Pada tab **Data**, pilih **Buka laporan tersimpan** atau tekan **Buka laporan**. Laporan peserta yang dipilih langsung membuka tab **Sketch**, dengan indikasi dan foto tersimpan dimuat kembali. **Muat ulang** memuat daftar laporan serta daftar Test Piece dari server.

Pada HP, gunakan tab bawah **Data**, **Sketch**, **Indikasi**, **Foto**, dan **Kirim**. Data memuat nama dan Test Piece, Sketch untuk menggambar, Indikasi untuk daftar/Edit, Foto untuk lampiran, dan Kirim untuk ringkasan serta tombol simpan/kirim. Perpindahan tab mempertahankan isian yang sedang dikerjakan; refresh memulihkan tab terakhir bersama snapshot draft. Setelah menyimpan ukuran indikasi, aplikasi berpindah ke tab Indikasi. Pada laptop, tampilan lengkap tetap tersedia.

1. Penguji masuk, membuka **Kunci jawaban**, mengisi Test Piece ID, menggambar indikasi, menambahkan foto opsional, lalu **Terbitkan kunci**.
2. Peserta langsung mengisi nama lengkap dan Test Piece ID, menggambar dan mengisi data indikasi, lalu **Simpan draft** atau **Kirim laporan**. Peserta dapat mengirim walaupun kunci belum diterbitkan. Laporan tersebut menunggu kunci sebelum evaluasi.
3. Penguji membuka **Pemeriksaan**, memilih laporan pada **Buka laporan tersimpan**, lalu membandingkan dengan kunci yang terikat saat laporan dikirim. Jika saat pengiriman belum ada kunci, halaman penguji menampilkan kunci terbaru yang telah diterbitkan untuk Test Piece yang sama. Kunci yang ditampilkan tersebut dikirim bersama evaluasi dan diikat secara permanen ketika evaluasi disimpan. Tanpa kunci yang valid, evaluasi ditolak tetapi laporan tetap diterima.
4. Pasangkan indikasi, periksa selisih/overlay, isi hasil dan catatan, lalu **Simpan evaluasi**. Centang **Bagikan catatan kepada peserta** bila catatan sudah boleh dibaca.
5. Peserta membuka laporan tersimpan untuk membaca catatan yang telah dibagikan. Data dan foto kunci tidak diberikan kepada akun peserta.

**Simpan indikasi** memasukkan indikasi ke daftar dan langsung menyimpan draft ke server. Tunggu pesan **Indikasi dan draft berhasil disimpan ke server** sebelum menutup halaman. Jika jaringan gagal, perubahan tetap berada di halaman dan dapat dikirim ulang melalui **Simpan draft**. Simpan draft/kirim mengirim model goresan beserta foto terkompresi ke Drive; nomor indikasi diurutkan ulang oleh server berdasarkan From Y dan urutan pembuatan untuk nilai sama.

Klik **Edit** pada baris indikasi untuk memperbarui Length, Width, From Y, tipe, keputusan, atau catatan. Gunakan **Lanjut gambar** untuk menambah goresan, **Hapus goresan** untuk menggambar ulang, dan **Batal edit** untuk kembali ke data terakhir. **Simpan perubahan** memperbarui draft di server serta nomor urut berdasarkan From Y tanpa mengganti ID indikasi.

Setelah menggambar satu atau beberapa goresan, tekan **Selesai menggambar**. Pop-up **Detail ukuran indikasi** langsung terbuka dan fokus ke Length. Isi Length, Width, From Y, tipe, dan keputusan, lalu simpan. Tombol **Edit** juga membuka pop-up yang sama. **Kembali** atau Escape menutup pop-up sambil mempertahankan isian yang sedang dikerjakan. Aplikasi memakai tema terang tetap, termasuk saat perangkat HP menggunakan tema gelap.

Untuk laporan final milik sendiri, tombol **Edit** atau **Edit sebagai revisi baru** membuat draft baru yang terhubung ke laporan sebelumnya. Kiriman lama dan evaluasinya tetap tersedia. Setelah selesai, kirim/terbitkan revisi itu melalui tombol utama. Akun lain, termasuk penguji yang sedang memeriksa jawaban peserta lain, tidak dapat merevisi jawaban tersebut.

Gunakan **Laporan baru** untuk membuat laporan kosong. Simpan draft sebelum berpindah layar atau membuat laporan baru; perubahan yang belum disimpan dapat hilang. Foto yang baru dipilih juga perlu disimpan melalui tombol simpan/kirim.

Refresh pada tab peserta yang sama memulihkan snapshot draft browser: nama, Test Piece ID, daftar indikasi, foto, goresan aktif, isian pop-up, status laporan, dan referensi draft server. Snapshot diperbarui saat isian berubah, goresan selesai, tampilan diperbarui, dan sebelum halaman ditinggalkan. Jika kiriman masih menunggu respons saat refresh, ID retry dipertahankan untuk mencegah kiriman ganda. Pemulihan browser berbeda dengan penyimpanan server: **Simpan draft**, **Simpan indikasi**, atau **Kirim laporan** tetap diperlukan untuk mengirim data ke Drive/Sheets. Jika browser menolak penyimpanan lokal karena kapasitas/izin, aplikasi menampilkan pemberitahuan. Snapshot tidak dijanjikan setelah tab ditutup atau data browser dibersihkan; sesi server tetap memiliki masa berlaku.

Laporan yang sudah pernah disimpan sebelum pembaruan ini dapat dibuka dari **Buka laporan tersimpan** selama sesi peserta masih berlaku. Data yang hanya ada di layar dan sudah hilang sebelum fitur pemulihan terpasang tidak dapat dipulihkan dari server.

## Batas integrasi awal

- Template saat ini 200 × 200 × 5 mm; From Y divalidasi 0–200 mm.
- Test Piece ID menggunakan huruf/angka dan spasi atau tanda `_ . / -`, diawali huruf/angka, maksimal 80 karakter.
- Maksimal 30 indikasi, 100 goresan per indikasi, dan 200 titik per goresan.
- Satu foto JPG/PNG per laporan/kunci, sumber maksimal 10 MB. Browser mengompresi menjadi JPEG, sisi terpanjang 2000 px, maksimal 2 MB.
- Foto disimpan bersama model sketch dalam JSON privat di Drive; tidak membuat tautan publik.
- Data aplikasi lama tidak dimigrasikan otomatis ke model goresan baru. Salinan kode lama ada di `docs/legacy-before-integration/`.
- Pembukaan revisi terkontrol, manajemen sesi training, autosave, dan ekspor cetak lengkap masih pekerjaan berikutnya.

## Pengujian dan deployment

Jalankan **node tmp/test-integration.cjs** untuk menguji dengan tiruan layanan Apps Script: login/hash, otorisasi, kepemilikan, sorting, retry/idempotensi, final lock, versi kunci, feedback privat/publik, konflik revisi, validasi, logout, dan startup UI.

File yang dikirim oleh clasp hanya `appsscript.json`, `Code.gs`, dan `Index.html`. `clasp push` mengubah sumber proyek remote dan bisa memengaruhi deployment @HEAD; URL versi produksi yang sudah bernomor tetap menggunakan versinya. Setelah sumber diunggah, buat deployment versi baru dan uji memakai akun instruktur serta peserta. Uji layanan Google langsung belum selesai selama upload/deployment belum diizinkan.

