# Deployment MT Sketch Review

Versi Apps Script: **52**

Versi 52 memperbaiki layout HP versi 51: pemeriksaan DOM menunjukkan HTMLService membuang blok CSS reviewer baru, sehingga layout grid dan touch-action tidak diterapkan. Layout tab tiga kolom, sticky dan touch-action pan-y kini diterapkan melalui renderer/resizer aplikasi, sementara gesture tetap memakai Pointer Events. Pengujian drag otomatis di IAB tidak dapat dilakukan karena batas koordinat frame pecahan; logika gesture diuji dengan fixture Pointer Events. Gestur sentuh perangkat Android masih perlu verifikasi pengguna.

[Buka versi 52](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=52)

Versi 51 menambahkan swipe horizontal di HP (viewport maksimal 720px) pada bagian utama penguji: Examination → Master Key → Batch. Swipe kiri menuju tab berikutnya, kanan sebelumnya; ujung daftar tidak berputar. Login baru tetap membuka Examination, sementara refresh memulihkan bagian terakhir sesuai versi 47. Tombol tab tetap dapat diklik, diratakan tiga kolom dan sticky pada HP, serta perpindahan memakai animasi slide singkat yang menghormati prefers-reduced-motion.

Gesture mengabaikan scroll vertikal, gerakan pendek/lambat, multi-pointer, popup terbuka, input/form/tabel/kanvas, editor kunci, peserta, desktop dan proses server yang sedang berjalan. Gesture pada tombol nav diizinkan; click sesaat setelah swipe diblokir untuk mencegah salah tekan. Isian batch yang belum disimpan diingat saat berpindah tab dan dalam snapshot sesi; sesudah tambah berhasil isian dikosongkan.

Tes unit urutan/arah/batas, scroll dan target yang diblokir, mode/role/busy, preservasi batch draft lulus. Regresi backend dan sesi penguji lulus.

[Buka versi 51](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=51)

Versi 50 mengelompokkan tampilan Master Key per kode dasar Test Piece: suffix A/B (spasi atau setelah angka) menjadi side dalam satu kelompok. Daftar memakai baris rapat tanpa gap kartu; tombol Edit membuka matriks side A/B × MT/PT dengan status dan aksi Buat key, Lanjut draft, Edit/Revisi, Lihat/Riwayat sesuai data. Status tetap hanya muncul di dalam Edit. Edit data side berada dalam details terpisah di modal. Daftar menampilkan hitungan nomor dan side/entri.

Pengelompokan hanya frontend: kode katalog/sketch/laporan dan data kunci tetap menggunakan ID side asli. Entri tanpa side tetap tampil, side yang belum ada tidak memiliki tombol membuat key, dan ID dasar tanpa side yang berdampingan dengan A/B tetap dipertahankan sebagai baris tambahan dalam modal. Baris desktop lebih padat, tombol HP tetap memiliki target sentuh 44px.

Tes grouping, suffix kompak, side hilang/standalone, ID asli tidak berubah, mapping side/metode dan daftar tanpa status lulus; regresi backend lulus.

[Buka versi 50](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=50)

Versi 49 menghapus Cari Test Piece, Metode dan Status key dari Master Key. Daftar menampilkan semua katalog aktif, tanpa dipengaruhi filter tersimpan versi lama. Form tambah yang sebelumnya details inline diganti tombol primary plus Add Test piece, dengan dialog ID/keterangan, Add dan Batal. Setelah tambah berhasil katalog serta adminData diperbarui agar record baru langsung dapat diedit. Kegagalan muat ulang setelah commit dibedakan dari kegagalan penambahan. Tidak ada perubahan API/database penambahan.

Nama menu Pemeriksaan diganti Examination pada navigasi atas/sidebar, breadcrumb, heading dan tombol terkait. Filter di Examination tetap tersedia. Tes renderer daftar sederhana dan regresi backend lulus.

[Buka versi 49](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=49)

Versi 48 menghapus menu Laporan peserta yang terpisah di penguji (atas dan sidebar); laporan tetap tersedia melalui Pemeriksaan beserta Edit. Nama Test Piece & Master Key diganti Master Key pada menu, heading, breadcrumb dan tombol kembali. Menu atas penguji: Pemeriksaan, Master Key, Batch. Pemulihan sesi lama dengan bagian reports diarahkan ke Pemeriksaan; setelah edit/hapus data laporan, tampilan juga kembali ke Pemeriksaan. Menu peserta tetap tersedia saat role Peserta. Tidak ada perubahan database/izin.

Tes renderer hub dan pemulihan sesi penguji lulus.

[Buka versi 48](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=48)

Versi 47 menyimpan token sesi penguji dan pilihan bagian/filter pada sessionStorage tab yang sama. Password tidak disimpan. Setelah refresh, endpoint me memvalidasi token server sebelum role Penguji dipulihkan; token tidak diperpanjang dan masa cache penguji tetap sekitar 1 jam. Salah role, token kedaluwarsa/rusak ditolak. Gangguan jaringan mempertahankan token untuk retry. Memilih Peserta/logout menghapus snapshot penguji dan mengakhiri sesi server; snapshot peserta tetap terpisah.

Bagian penguji, filter dan laporan/kunci tersimpan yang terakhir dibuka dipulihkan bila masih tersedia. Editor key baru tanpa record kembali ke Test Piece; perubahan penguji yang belum disimpan ke server tidak dijanjikan pulih. Tes me/session dan helper resume memverifikasi role server, expired/wrong-role/malformed snapshot, koneksi, pilihan bagian/filter serta tidak adanya password pada snapshot; regresi backend dan pemulihan draft peserta lulus.

[Buka versi 47](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=47)

Versi 45 menambahkan nomor Test Piece biru di tengah bagian atas pelat SVG, sesuai referensi. Nomor mengikuti pilihan peserta, dokumen kunci/pemeriksaan dan ekspor PNG. Label dikodekan aman dan kode panjang dibatasi pada ruang antar lubang pelat. Mengganti pilihan Test Piece merender ulang label sambil mempertahankan isian indikasi. Browser memverifikasi label MT PT 113 B mengikuti pilihan; tes PNG menghasilkan label pada sketch dan lulus inspeksi visual. Bukti docs/screenshots/sketch-testpiece-label-v45.png.

Versi 46 memindahkan panjang/lebar/tebal ke dialog native yang dibuka dari Add Dimension. Setelah diterapkan tampil ringkasan serta Edit Dimension. Add Indication sebelum dimensi diterapkan membuka dialog yang sama. Kesalahan validasi muncul di dalam modal; Tutup/Batal tidak mengubah dimensi yang sudah diterapkan. Format data dan validasi backend tetap.

Verifikasi online: tidak ada form dimensi inline; Add Dimension membuka popup, panjang 0 ditolak di modal, 350 × 150 × 8 diterapkan dan dialog ditutup, Edit Dimension membuka kembali nilai tersebut, Batal pada perubahan 450 mempertahankan panjang 350. Regresi backend/draft/PNG lulus. Tidak ada laporan uji disimpan ke produksi. Bukti docs/screenshots/add-dimension-popup-v46.png.

[Buka versi 46](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=46)

Versi 44 menghapus tulisan Wajib diisi/Wajib dipilih dari nama, batch, metode dan dimensi. Validasi nilai/isian tetap berjalan.

Sampah/Pulihkan dihilangkan dari seluruh UI. Penghapusan baru memerlukan konfirmasi Hapus permanen, role Penguji, revision/version sesuai, dan confirmDelete=true. Katalog serta laporan dihapus dari baris database aktif, dan tidak ada endpoint restore. Kunci yang dihapus dikeluarkan dari MT_Records; metadata/file acuan kunci yang sudah terikat laporan dipertahankan privat di MT_KeyReferences hanya untuk pembacaan/evaluasi historis. Referensi tersebut tidak dapat dimuat sebagai kunci aktif, direvisi atau dipilih untuk laporan baru. JSON Drive revisi historis tidak dipurge. Data yang pernah masuk Sampah versi lama tetap tersembunyi; tidak ada pembersihan massal otomatis.

MT_DeletedRequests menyimpan UserID/RequestID/RemovedID untuk menolak retry lama yang dapat membuat ulang data terhapus. Draft revisi yang sudah dibuat tetap dapat dilanjutkan setelah sumber dihapus. Kode katalog yang benar-benar dihapus dapat didaftarkan ulang. Tes fixture memverifikasi row removal, penolakan restore/akses peserta/versi stale/konfirmasi kosong, anti-replay, acuan pinned/unpinned, serta kelanjutan revisi. Tidak ada penghapusan produksi dilakukan untuk pengujian.

[Buka versi 44](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=44)

Versi 43 menghapus panel status MT/PT dari kartu daftar Test Piece. Status serta seluruh aksi master key hanya tersedia di Edit Test Piece → Master key. Kartu daftar hanya menampilkan kode, Detail Test Piece bila ada keterangan, dan Edit Test Piece; filter metode/status tetap tersedia untuk pencarian. Tidak ada perubahan penyimpanan atau backend.

[Buka versi 43](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=43)

Versi 42 memindahkan tombol master key ke dialog Edit Test Piece, bagian Master key MT/PT. Daftar hub tetap menampilkan status saja. Edit menampilkan Buat master key, Lanjut draft, Lihat key, Edit/Revisi, Detail/Riwayat sesuai status masing-masing metode. Membuka aksi key menutup dialog pengelolaan katalog sebelum beralih ke editor/riwayat. Dialog memberi petunjuk agar perubahan kode/keterangan disimpan sebelum mengelola key. Data katalog terhapus tidak menampilkan aksi pembuatan key.

Tes status/action renderer memastikan tombol create-key tidak muncul pada daftar, hanya pada panel edit; regresi integrasi backend lulus.

[Buka versi 42](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=42)

Versi 41 menjadikan Test Piece & Master Key sebagai pusat pengelolaan master key, menggantikan pintu masuk daftar kunci terpisah. Setiap Test Piece aktif menampilkan status MT dan PT: Sudah submit key (Published), Draft belum submit, atau Belum ada key. Jika Published dan Draft sama-sama ada, status tetap terbit dengan catatan draft revisi. Status dibaca dari data kunci yang sudah ada, tanpa migrasi dokumen.

Buat master key pada panel metode membawa Test Piece/metode langsung ke editor. Lanjut draft dan Edit/Revisi memakai alur revisi versi 40. Lihat key membuka kunci terbit; Detail/Riwayat membuka daftar kunci terfilter Test Piece/metode. Sampah key dan Sampah Test Piece tetap tersedia; Test Piece terhapus harus dipulihkan sebelum membuat kunci. Setelah Terbitkan kunci, UI kembali ke hub dengan data server yang diperbarui. Pencarian kode/keterangan, filter metode dan status tersedia; saat semua metode dipilih, filter status cocok jika salah satu metode memenuhi.

Tes status per Test Piece/metode, draft revisi, pengecualian data terhapus/peserta, pencarian, filter serta konteks tombol buat lulus. Regresi integrasi backend dan daftar kunci lulus.

[Buka versi 41](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=41)

Versi 40 meringkas daftar kunci menjadi kartu Test Piece, MT/PT, status dan Edit. Detail (tertutup awal) menampilkan metode lengkap, revisi, waktu, pembuat, ID dan tombol Lihat sketch/indikasi. Filter tetap tersedia. Edit membuka dialog dengan Edit sketch dan indikasi serta Hapus. Kunci terbit atau milik penguji lain dibuatkan draft revisi milik penguji aktif, tanpa menimpa sumber. Draft milik sendiri dibuka langsung. Endpoint staff-only reviseKey memvalidasi versi dan request ID; backend mengizinkan sumber revisi master antar penguji saja.

Hapus kunci memakai Sampah/Pulihkan dan metadata penghapusan yang sudah ada. Kunci di Sampah tidak menjadi acuan laporan baru. Laporan yang telah terikat pada kunci tetap memuat snapshot kunci dan dapat dievaluasi; kunci terhapus tidak boleh dipilih untuk laporan yang belum terikat. Label Acuan terbaru mengikuti urutan kunci terbit aktif yang dipilih backend, termasuk setelah pemulihan.

Tes lokal integrasi, izin peserta, revisi/copy/idempotency/konflik versi, hapus-pulihkan, pinned/unpinned evaluation dan filter/detail/list lulus. Pengujian online hanya membuka daftar, detail, dialog Edit dan konfirmasi Hapus; tidak mengubah atau menghapus kunci produksi.

[Buka versi 40](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=40)

Versi 39 menamai brand dan judul browser NDT Sketch, memakai ikon sketch netral untuk MT/PT. Header laporan tetap Practical Report (Sketch). Ikon PNG 512 × 512 diperbarui pada file Drive publik yang telah disetujui pengguna, tanpa memperluas akses laporan. Versi 38 memperbaiki URL favicon PNG setelah versi 37 menolak format URL tanpa ekstensi; doGet menangani kegagalan favicon agar halaman tetap terbuka.

Browser online memverifikasi judul NDT Sketch, brand baru, halaman peserta normal dan link shortcut icon bertipe image/png pada halaman terluar. Metadata Drive memverifikasi berkas NDT Sketch - Public App Icon.png dan anyone reader khusus ikon. Shortcut Chrome Android belum diperiksa langsung pada perangkat; buat ulang shortcut dari URL v39 untuk mengambil nama/ikon baru.

[Buka NDT Sketch v39](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=39)

Versi 36 membuka daftar khusus ketika Penguji memilih Kunci jawaban (menu atas atau sidebar). Daftar memuat Test Piece, metode, status Draft/Terbit, revisi simpan, waktu diperbarui, ID dan tombol Buka. Filter metode, Test Piece dan status dapat digabung. Kunci terbit terbaru per metode/Test Piece ditandai Acuan terbaru; kunci lama tetap terlihat. Desktop memakai tabel dan HP kartu. Tombol Buat kunci baru membuka editor kosong; tombol Daftar kunci kembali ke daftar.

Hak edit tetap mengikuti pemilik kunci. Kunci milik sesi penguji menyediakan Edit draft atau Buka/Revisi; kunci akun lain dapat dibuka dengan batas izin yang sudah berlaku. Membuka kunci tidak menerbitkan revisi atau mengubah dokumen. Tidak ada perubahan backend pemilihan/pengikatan kunci.

Verifikasi: tes lokal list master-only, kombinasi filter, versi lama/draft, acuan terbaru, Test Piece historis, aksi sesuai pemilik, empty state dan integrasi backend lulus. Browser produksi menunjukkan 3 kunci (2 terbit, 1 draft), filter PT menghasilkan kosong, filter Draft menghasilkan 1 baris; Buka berhasil memuat sketch kunci dan tombol Daftar kunci kembali ke daftar. Tidak ada kunci/revisi tiruan dibuat. Bukti docs/screenshots/key-list-v36.png.

[Buka versi 36](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=36)

Versi 35 menambahkan Edit pada database Test Piece, Batch, serta menu Laporan peserta. Dialog edit menyediakan Hapus dengan konfirmasi lalu memindahkan ke Sampah. Masing-masing database memiliki Sampah dan Pulihkan; tidak ada penghapusan permanen atau file Drive yang dibuang.

Edit laporan mencakup nama, batch, metode dan Test Piece, mempertahankan pemilik/sketch/indikasi/foto serta membuat file JSON revisi dengan rujukan file sebelumnya. Perubahan metode/Test Piece menghapus evaluasi dan keyId, mengembalikan Reviewed menjadi Submitted untuk evaluasi ulang. Draft tetap Draft. Perubahan identitas/batch mempertahankan evaluasi. Database laporan mencakup draft dan laporan final, serta dapat difilter batch.

Katalog mengizinkan perubahan kode hanya sebelum dipakai laporan; kode yang sudah direferensikan tetap, nama/keterangan dapat diedit. Penghapusan katalog menyembunyikan pilihan aktif sambil mempertahankan data historis. Pulihkan katalog sebelum memilihnya lagi pada laporan baru. Entri Sampah juga memblokir penggunaan kode duplikat. Metadata DeletedAt/Version pada katalog dan DeletedStatus/DeletedAt pada MT_Records menjaga pemulihan, status sebelumnya dan konflik edit. Seluruh endpoint pengelolaan memerlukan role Penguji.

Verifikasi: tes backend admin-only, edit metadata dan pemilik/sketch tetap, konflik versi, evaluasi ulang, hapus/pulihkan laporan/katalog, katalog publik, duplikat, dan proteksi kode terpakai lulus; regresi batch/draft/modal/PNG lulus. Browser online membuka dialog edit ketiga database, menampilkan konfirmasi Hapus, dan memeriksa tombol Simpan/Hapus pada HP 390 × 844. Tidak ada perubahan/hapus pada data produksi selama pengujian UI; perubahan/pemulihan diuji dengan Sheets/Drive fixture lokal. Bukti docs/screenshots/admin-edit-v35.png dan admin-edit-mobile-v35.png. Pembaruan mempertahankan perubahan UI versi 32–34 yang telah ada di workspace.

[Buka versi 35](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=35)

Versi 34 memperbaiki label pilihan dropdown pada kolom Pasangan di tabel komparasi indikasi (menu Pemeriksaan). Label yang sebelumnya bertuliskan Peserta 1, Peserta 2, dst. telah diperbaiki menjadi Indikasi 1, Indikasi 2, dst. Hal ini memperjelas bahwa penguji sedang memasangkan nomor indikasi kunci jawaban dengan nomor indikasi temuan peserta pada benda uji tersebut.

[Buka versi 34](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=34)

Versi 33 menambahkan tampilan daftar laporan peserta langsung dalam bentuk list/tabel pada menu Penguji → Pemeriksaan setelah menyortir/memfilter Batch dan Metode. Penguji tidak perlu lagi membuka dropdown satu per satu. Setiap baris laporan menampilkan nomor urut, nama peserta, batch, metode (badge MT/PT), kode Test Piece, status evaluasi (Menunggu evaluasi / Sudah dievaluasi beserta hasil), waktu submit, dan tombol aksi Periksa / Lihat Evaluasi. Mengklik tombol Periksa langsung membuka workspace komparasi visual side-by-side, lengkap dengan tombol navigasi Kembali ke daftar laporan di bagian atas dan bawah workspace. Tampilan responsif menyediakan tabel untuk desktop dan kartu terstruktur untuk perangkat HP.

[Buka versi 33](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=33)

Versi 32 menyederhanakan alur kerja pengisian dimensi test piece: form dimensi wajib diisi terlebih dahulu sebelum menambah indikasi. Begitu tombol **Terapkan dimensi** ditekan, formulir otomatis disembunyikan (*hidden*) dan digantikan oleh bilah ringkasan dimensi yang ringkas lengkap dengan tombol **Ubah dimensi** untuk mengedit kembali jika diperlukan. Ketika bilah ubah dibuka, tersedia tombol **Sembunyikan / Batal** untuk menutupnya kembali tanpa mengubah data. Laporan tersimpan dan revisi yang telah memiliki dimensi otomatis dimuat dalam status tersembunyi.

[Buka versi 32](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=32)

Versi 31 menambahkan database MT_Batches (BatchID, NamaBatch, CreatedBy, CreatedAt), katalog batch publik, serta menu Penguji → Batch untuk menambah kode/nama. Kode dinormalisasi uppercase, duplikat ditolak, hanya penguji dapat menambah. Database awal kosong karena belum ada kode batch resmi yang diberikan.

Peserta wajib memilih batch untuk simpan/kirim. Batch disimpan di JSON, metadata/kolom Batch MT_Records (kolom 15), draft lokal, ringkasan dan PNG. Kunci jawaban lintas batch tetap dipasangkan berdasarkan Test Piece dan metode. Laporan lama tanpa batch tetap tersedia melalui filter Tanpa batch (laporan lama).

Penguji → Pemeriksaan memiliki filter Semua batch, setiap batch, dan Tanpa batch. Dropdown laporan hanya menampilkan laporan terkirim/ditinjau dalam batch tersebut; perubahan filter mengosongkan laporan aktif. API list juga mendukung filter batch untuk penguji. Filter adalah pengelompokan kerja, bukan pembatasan hak penguji.

Validasi: tes backend katalog/tambah batch, izin, duplikat, kode belum terdaftar/kosong, simpan/load/filter, dan legacy bucket lulus; tes filter frontend, pemulihan draft, PNG, dimensi, dialog, indikasi, RPC dan rotasi lulus. Browser online memastikan pilihan Batch peserta, menu/form Batch penguji, serta filter Tanpa batch dengan 2 laporan lama. Tidak ada batch atau laporan tiruan ditambahkan ke produksi. Bukti: docs/screenshots/batch-manager-v31.png dan batch-filter-v31.png.

[Buka versi 31](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=31)

Versi 30 menambahkan form panjang (arah From Y), lebar, tebal dalam mm pada tab Sketch untuk peserta dan kunci. Terapkan dimensi memperbarui label sketch, metadata, ringkasan dan PNG. Template tetap skematis. Dimensi disimpan pada JSON laporan dan pemulihan draft. Laporan lama memakai 200 × 200 × 5 mm. Frontend/backend memvalidasi nilai positif hingga 100.000 mm; From Y mengikuti panjang. Dimensi kunci dan peserta ditampilkan sendiri pada pemeriksaan.

Foto yang diunggah memiliki tombol putar 90° kiri/kanan selama draft. Rotasi ditulis menjadi data JPEG baru, bukan hanya transform CSS, sehingga ikut tersimpan dalam draft dan Drive saat pengguna menyimpan/mengirim. Foto laporan final terkunci sampai dibuat revisi.

Verifikasi: tes integrasi, batas From Y, validasi dimensi, pemulihan draft, form/modal/RPC, ekspor PNG, dan operasi canvas rotasi lulus. Browser online dengan viewport 390 × 844 memastikan dimensi 350 × 150 × 8 mm tampil pada sketch dan tetap pulih setelah refresh; bukti docs/screenshots/dimensions-mobile-v30.png. Pengujian unggah foto melalui file chooser otomatis tidak tersedia (timeout), sehingga alur unggah lalu rotasi di HP belum diverifikasi langsung. Tidak ada laporan uji dikirim ke produksi.

[Buka versi 30](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=30)
Versi 29 menghapus dropdown dan tombol Buka laporan tersimpan dari peserta; riwayat penguji tetap tersedia. Setelah kirim berhasil, tab Kirim menyediakan Simpan gambar (PNG), pratinjau, Unduh PNG, serta Bagikan gambar bila didukung perangkat. PNG mencakup identitas, metode, Test Piece, ID/waktu kirim, sketch bernomor, dan seluruh tabel indikasi. Ekspor hanya tersedia bagi laporan peserta sendiri yang sudah dikirim.

Pemeriksaan online memastikan versi 29 dimuat dan kontrol riwayat peserta tidak ada. Renderer PNG lokal diuji sampai menghasilkan file PNG nyata dan diperiksa secara visual; guard sebelum submit dan tes regresi integrasi, draft, dialog, form, serta RPC lulus. Tidak ada laporan tiruan dikirim ke database produksi, sehingga unduhan setelah submit nyata perlu dicoba pada kiriman peserta berikutnya. Versi 29 juga memperbaiki perubahan literal namespace SVG oleh HtmlService yang ditemukan pada versi 28. Contoh PNG: docs/screenshots/report-png-example-v29.png.

[Buka versi 29](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=29)

Versi 27 mengganti header teratas dan judul browser menjadi Practical Report (Sketch), menghapus judul laporan praktikum lama dari area isi, serta menambahkan urutan Nama → Metode → Test Piece. Metode wajib Magnetic Particle Testing atau Penetrant Testing, disimpan pada JSON dan kolom Metode MT_Records, dipulihkan saat refresh, serta dipakai untuk memasangkan kunci/evaluasi sesuai metode. Laporan lama tanpa field metode dibaca sebagai Magnetic Particle Testing. Test Piece tetap memakai database bersama; mengganti metode mengosongkan pilihan Test Piece.

Uji browser HP: metode awal disabled sebelum nama, Test Piece disabled sebelum metode, kedua metode bisa dipilih, pergantian metode mengosongkan Test Piece, dan refresh mengembalikan metode serta Test Piece yang dipilih. Tes backend lulus untuk metode wajib, penolakan metode tidak valid, pemisahan kunci MT/PT pada Test Piece sama, dan evaluasi sesuai metode. Bukti `docs/screenshots/report-method-v27.png`.

[Buka Practical Report (Sketch)](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=27)

Versi 26 menambahkan database MT_TestPieces, dropdown Test Piece untuk peserta/kunci, dan menu Penguji → Test Piece untuk menambah ID/keterangan. Database diinisialisasi dari ID pada MT_Records, dengan default MTPT 02 B bila kosong. Backend menolak ID duplikat, penambahan oleh peserta, serta penyimpanan laporan dengan ID di luar database.

Riwayat peserta kini memiliki kunci pemulihan acak di localStorage; hash kunci disimpan bersama identitas peserta di MT_Participants. Kunci ini memperbarui sesi cache tanpa membuat identitas baru. Sesi lama yang masih valid dapat ditautkan saat pertama menggunakan versi ini. Riwayat tidak dapat direkonstruksi hanya dari nama atau dipulihkan setelah seluruh data browser/kunci hilang. Laporan lama tetap dapat dilihat penguji. Memilih laporan kini langsung membuka tab Sketch dengan pesan sukses dan tombol Buka laporan tersedia.

Tes lokal lulus untuk daftar/tambah Test Piece, duplikat, izin, ID belum terdaftar, pemulihan sesi setelah logout, muat laporan setelah resume, dan isolasi peserta bernama sama. Pemeriksaan browser langsung memastikan dropdown berisi MTPT 02 B, MTPT 12 B, MTPT 99 A yang diimpor dari data lama, serta menu/form tambah Test Piece tersedia untuk penguji. Tidak ada test piece atau laporan tiruan ditambahkan pada database nyata. Bukti `docs/screenshots/test-piece-database-v26.png`.

[Buka dropdown dan database Test Piece](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=26)

Versi 25 menyediakan dua tab atas Peserta / Penguji. Memilih Penguji membuka native dialog password saja. Password yang ditentukan pengguna, 4321, diperiksa melalui hash di backend; frontend tidak menyimpan nilai password. Login berhasil menerbitkan sesi penguji bersama SHARED_REVIEWER. Pembatasan percobaan diterapkan server. Tombol Masuk penguji di Data dihapus. Menu penguji menyediakan Kunci jawaban dan Pemeriksaan. Kembali ke Peserta mempertahankan snapshot/sesi peserta yang sebelumnya digunakan.

Uji langsung browser: password 0000 ditolak dengan pesan Password penguji salah; 4321 membuka menu penguji dan menutup dialog; kembali ke Peserta memulihkan nama draft yang diketik sebelum login. Tidak ada laporan uji dikirim. Bukti tampilan `docs/screenshots/reviewer-login-v25.png`.

[Buka tab Peserta / Penguji](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=25)

Versi 24 membagi editor mobile menjadi tab Data, Sketch, Indikasi, Foto, dan Kirim dengan navigasi bawah tetap serta safe-area padding. Kirim berisi ringkasan sebelum submit. Berpindah tab mempertahankan active indication/isian, dan tab pilihan tersimpan dalam snapshot draft. Desktop mempertahankan layout lengkap. Uji browser HP berhasil membuka Sketch, Foto, dan Kirim; nama pada Data muncul di ringkasan dan tetap ada setelah refresh bersama tab Kirim. Tidak ada data uji yang dikirim ke server. Bukti tampilan `docs/screenshots/mobile-tabs-v24.png`.

[Buka aplikasi dengan tab mobile](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=24)

Versi 23 membatasi intrinsic/min-content width pada grid, input, dan kontainer tabel. Daftar indikasi pada HP memakai kartu dengan tombol Edit di kepala kartu; tabel tetap digunakan di desktop. Formulir dan tombol footer ditumpuk pada layar sempit. Pengujian browser dengan viewport HP berhasil menampilkan kartu, membuka Edit ke dialog, dan memulihkan draft setelah reload. Pembacaan DOM tidak menemukan kontrol/form/kartu yang melampaui lebar dokumen iframe. Bukti tampilan: `docs/screenshots/mobile-v23.png`. Data uji lokal tidak dikirim ke server karena nama dikosongkan.

[Buka perbaikan layout HP](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=23)

Versi 22 memulihkan draft peserta dari sessionStorage saat refresh pada tab yang sama. Snapshot mencakup nama, Test Piece, indikasi, foto, goresan/isian aktif, modal detail, referensi server, dan ID request yang sedang menunggu. Pembacaan daftar server setelah startup tidak menimpa draft lokal. Browser yang menolak penyimpanan memberi peringatan. Tes `tmp/test-refresh-recovery.cjs` lulus, termasuk roundtrip data, retry ID stabil, pemisahan peserta, JSON rusak, dan kapasitas storage.

[Buka versi dengan pemulihan refresh](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=22)

Versi 21 membuka halaman peserta langsung tanpa login aplikasi/Google. Nama lengkap wajib sebelum simpan/kirim; backend menerbitkan sesi acak khusus peserta. Nama disimpan pada dokumen dan kolom Nama MT_Records, kemudian terlihat oleh penguji. Penguji tetap login; token peserta tidak dapat membaca kunci atau laporan peserta lain meskipun namanya sama.

API deployment mengonfirmasi `ANYONE_ANONYMOUS` dan `USER_DEPLOYING`. Pemeriksaan HTTP tanpa sesi Google pada URL dengan `?v=21` menghasilkan 200, title MT Sketch Review, dan field mt-participant-name. URL tanpa parameter sempat mengembalikan redirect login Google yang tersimpan; gunakan tautan versi terbaru berikut:

[Buka halaman peserta langsung](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec?v=21)

Versi 20 menambahkan dialog detail ukuran setelah Selesai menggambar dan ketika Edit diklik. Dialog menggunakan satu formulir yang dipindahkan ke native dialog, fokus awal Length, serta Kembali/Escape yang mempertahankan isian. Tema mengikuti palet terang tetap dan color-scheme light. Tes dialog/fokus/penutupan serta regresi backend, form, dan RPC lokal lulus; pemeriksaan HP nyata tetap dilakukan pengguna setelah login dan refresh.

Versi 19 mengizinkan kiriman peserta sebelum kunci diterbitkan. Untuk laporan tanpa kunci awal, penguji melihat acuan terbaru yang tersedia dan kunci tersebut baru diikat ketika evaluasi disimpan. Kunci harus valid dan sesuai Test Piece. UI menampilkan status mengirim/menyimpan, mencegah klik ganda, dan menampilkan error/timeout 45 detik. Kegagalan memuat ulang daftar setelah commit tidak dianggap kegagalan penyimpanan. Tes tambahan `tmp/test-rpc-feedback.cjs` lulus, termasuk respons sukses, error server, koneksi, dan timeout. Keluhan pengguna terakhir adalah tidak muncul respons setelah menekan Kirim; penyebab spesifik pada sesi pengguna belum direproduksi secara langsung.

Versi 18 menambahkan tombol Edit per indikasi, Simpan perubahan, Batal edit, Lanjut gambar, Hapus goresan, serta pembuatan draft revisi dari laporan final milik sendiri. Revisi mempunyai ID laporan baru dan menyimpan referensi `revises`; laporan asli beserta evaluasinya dipertahankan. Tes lokal mencakup pengeditan draft, pengurutan ulang dengan ID indikasi tetap, kepemilikan sumber revisi, dan pengiriman ulang. Pengujian perangkat nyata setelah login masih perlu dilakukan pengguna.

Versi 17 memperbaiki pembacaan field Length dengan `elements.namedItem`, menambahkan penyimpanan server pada tombol Simpan indikasi, dan menampilkan kesalahan validasi pada formulir. Pengujian regresi: `node tmp/test-indication-form.cjs` dan `node tmp/test-integration.cjs` lulus. URL tetap sama. Hak akses tetap `ANYONE` (memerlukan login Google); keluhan HP masih menunggu pesan kesalahan dari pengguna agar penyebab spesifik dapat dipastikan.

Project ID: `165MKnw3fAk0iy6OcAUuk-rQjO57teON693sEHuBszWv0dANduXR9478m`

Deployment ID: `AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q`

[Buka aplikasi](https://script.google.com/macros/s/AKfycbxdHKkQ3SKMvqCHNa3rHt2vHpZWLxIb8ztSw-2Zcaj3Ji4_26FzX_Xao5mzWpDNcRQh8Q/exec)

Upload `Code.gs`, `Index.html`, dan `appsscript.json` serta pembuatan deployment baru berhasil setelah persetujuan eksplisit pengguna. Deployment produksi bernomor yang sudah ada tidak diperbarui.

Pemeriksaan HTTP tanpa sesi Google menghasilkan HTTP 200 pada halaman **Sign in - Google Accounts**, bukan halaman UI aplikasi. Pengujian layanan langsung dari login aplikasi sampai simpan/muat belum terverifikasi. Pengguna perlu membuka tautan, login Google, kemudian memakai akun yang disiapkan di `Master_Akun`.

Kode akses aplikasi minimal 6 karakter. Kode contoh lama 1234/5678 dan PIN kosong tidak diterima. Lihat [panduan integrasi](INTEGRASI_APPS_SCRIPT.md) untuk persiapan akun dan uji satu kunci jawaban, satu laporan peserta, foto, serta evaluasi.


Verifikasi online versi 41: 14 Test Piece aktif tampil; tombol Buat master key mengisi MT PT 113 A dan Magnetic Particle Testing otomatis, filter Sudah submit key menampilkan hasil kosong sesuai data aktif. Tidak ada key percobaan disimpan. Bukti docs/screenshots/testpiece-master-key-status-v41.png.

Uji browser versi 47: setelah login dan memilih Test Piece & Master Key dengan filter Penetrant Testing, reload memulihkan role Penguji, filter PT dan 14 katalog tanpa dialog password. Memilih Peserta lalu reload menghasilkan Peserta tanpa menu penguji. Bukti docs/screenshots/reviewer-after-refresh-v47.png. Tidak ada laporan/key uji disimpan.

Verifikasi online versi 50: 14 side menjadi 7 baris; modal Edit menampilkan empat sel dengan ID asli MT PT 113 A/B dan metode MT/PT yang benar. Pemeriksaan viewport HP 390 × 844 memastikan keempat sel tidak melampaui lebar frame. Bukti grouped-master-key-v50.png, master-key-side-matrix-v50.png dan master-key-side-matrix-mobile-v50.png di docs/screenshots. Tidak ada data produksi dibuat/diubah.

Verifikasi online versi 52 viewport 390 × 844: login awal Examination; computed style tab display grid tiga kolom sama lebar, position sticky, content touch-action pan-y. Klik Examination/Master Key/Batch berhasil dan draft kode batch tetap ada setelah berpindah pergi-pulang; draft uji dikosongkan tanpa disimpan. Gesture native otomatis tetap diblokir keterbatasan koordinat iframe IAB, sehingga tidak diklaim telah diuji pada hardware Android. Bukti docs/screenshots/reviewer-mobile-tabs-v52.png.
