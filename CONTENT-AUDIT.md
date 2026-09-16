# Audit konten — 4 September 2026, diperbarui 16 September 2026

> **Catatan pembaruan (16 September 2026).** Tiga pernyataan di dokumen ini
> sudah tidak berlaku dan diperbaiki di bagian "Perbedaan dan batas
> pemeriksaan": formulir kini terkirim sungguhan, panel total harga sudah
> dibuat, dan feed Instagram sudah memakai embed resmi aplikasinya. Sisa
> dokumen tetap sebagaimana adanya — temuannya masih berlaku untuk snapshot
> tanggal auditnya.

Sumber: https://nyuhbalivillas.com/. Cakupan: 74 URL yang sudah diimplementasikan dalam proyek, berdasarkan `src/data/seo.ts`. Audit membandingkan HTML lokal dengan HTML live, gambar `<img>`, dan gambar latar dari stylesheet live; pemeriksaan visual tambahan dilakukan di browser.

## Perbaikan

- URL `/life-coach-retreat-benefits` sekarang menampilkan layanan Life Coach with Psychologist seperti live, menggunakan data bersama halaman wellness. Empat poin pembuka dan bagian Meet our Teacher dipulihkan.
- Foto yang berbeda dari halaman sumber diselaraskan pada homepage properti, dining, daftar vila, honeymoon, retreat, wellness/gym, culture, wedding, dan services. Varian thumbnail retreat mengikuti halaman tempat kartu ditampilkan.
- Foto Best Price Guaranteed di kedua properti dan logo footer live dipulihkan.
- Foto kategori spa mengikuti tab live. Bootylicious dan Backne Care ditambahkan bersama durasi, harga, deskripsi, dan rangkaian perawatan.
- Menu cooking class, jadwal Balinese Class dan morning walk, aturan pakaian gym, durasi sesi healing, manfaat reiki, dan pengantar kontak Ubud yang terlewat dipulihkan.
- Teks artikel yang sebelumnya tergabung tanpa spasi diubah menjadi daftar yang terbaca.
- Pilihan formulir spa dipulihkan: 55 pilihan Ubud dan 7 Seminyak, termasuk deskripsi/harga, Preferred Time, dan persetujuan pemesanan. Harga diambil dari masing-masing formulir live; sebagian berbeda dari menu utama SPA.
- Galeri pilihan manual yang sebelumnya ditampilkan sebagai Instagram dihapus. Tautan akun resmi tetap tersedia.
- Perubahan pengguna yang sudah ada pada `/ubud/wellness` dipertahankan; foto yoga dan gym di halaman itu cocok dengan live.

## Validasi

- Seluruh 74 URL berhasil dibaca kembali setelah perbaikan.
- Pemeriksaan TypeScript (`npx tsc --noEmit`), ESLint (`npm run lint`), dan build produksi (`npm run build`) lolos. Build memerlukan akses Google Fonts.
- `git diff --check` lolos.
- Seluruh 281 URL gambar pada hasil render terakhir berhasil diakses. Satu URL pengganti yang menghasilkan 404 sudah dikoreksi, dan satu timeout berhasil saat diperiksa ulang.
- Audit URL gambar tersedia melalui `scripts/audit-content.py --check-images`; `--retry-images` hanya memeriksa gambar baru atau pemeriksaan yang sebelumnya gagal dari snapshot yang sama.
- Bukti HTML/CSS, perbandingan per URL, dan status gambar tersimpan sementara di `.next/content-audit/`. Folder build ini dapat dibersihkan oleh Next.js; jalankan audit lagi untuk membuat snapshot baru.

## Perbedaan dan batas pemeriksaan

Proyek belum identik 100% dengan live. Desain ulang mempertahankan hero tambahan dari foto pada halaman terkait, ringkasan artikel, rekomendasi artikel, dan daftar blog tanpa pagination live. Perbedaan itu masih muncul dalam hasil pembanding mentah dan tidak otomatis berarti salah konten.

**Feed Instagram sudah terintegrasi** — sejak audit ini ditulis, band Instagram memakai embed milik aplikasi feed-nya sendiri (`<seoboost-feed>`), bukan galeri pengganti. Ada tiga akun: @nyuhbalivillas, @nyuhbaliubud, dan @mahamayaspa.ubud untuk halaman SPA Ubud. Tata letak, jumlah kolom, dan kropnya adalah setelan aplikasi itu, bukan repositori ini.

**Formulir bukan lagi simulasi.** Ketiga belas formulir mengirim ke satu endpoint, `/api/contact`, yang memeriksa token Cloudflare Turnstile lalu mengirim email lewat SendGrid dalam permintaan yang sama. Konfirmasi hanya muncul bila pengiriman benar-benar berhasil — sebelumnya formulir mengganti dirinya dengan ucapan terima kasih apa pun yang terjadi.

**Panel "Reservation Review" sudah dibuat.** Total berjalan pada kedua formulir SPA menghitung harga, pajak & servis 21%, dan diskon — 20% di Seminyak, 15% di Ubud dengan syarat pemesanan minimal satu minggu sebelumnya. Rumus dan tarifnya dibaca langsung dari `updateReview()` pada masing-masing formulir live, dan setiap harga dicocokkan dengan atribut `data-price` di markup live: ketujuh harga Seminyak dan ketiga puluh sembilan harga Ubud cocok sampai ke rupiah.

**Yang masih belum ada: pembayaran deposit.** Formulir mengirimkan permintaan; pembayarannya diurus terpisah oleh resor. Audit ini tidak menguji transaksi.

Email laporan pada Explore Bali tetap memakai alamat reservasi publik Seminyak. Teks live pada paragraf tersebut masih menunjuk `info@preview.nyuhbalivillas.com`; alamat staging itu tidak disalin kembali. Copyright memakai tahun berjalan. Beberapa perbedaan pemisahan paragraf dan pemenggalan kata live dipertahankan dalam bentuk yang terbaca.

Temuan berlaku untuk snapshot tanggal audit, bukan jaminan terhadap perubahan konten live di masa mendatang. Audit tidak mencakup URL live baru di luar 74 URL proyek.
