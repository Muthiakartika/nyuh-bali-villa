# Audit konten

Prasyarat: Python dengan `beautifulsoup4`, server proyek di `http://localhost:3001`, serta izin jaringan untuk website live.

```sh
python scripts/audit-content.py
python scripts/audit-content.py --check-images
python scripts/audit-evidence.py
python scripts/audit-images.py
```

Hasil sementara berada di `.next/content-audit/`. HTML dan CSS live dicache; gunakan direktori cache baru/bersih saat membandingkan dengan snapshot live yang lebih baru. Jangan menganggap hasil mentah sebagai keputusan otomatis: kartu artikel tambahan, perubahan susunan paragraf, stylesheet bersama, dan gambar dinamis memerlukan tinjauan manusia. Daftar route berasal dari `src/data/seo.ts`.

Untuk mengulang hanya gambar baru atau yang sebelumnya gagal dalam snapshot yang sama:

```sh
python scripts/audit-content.py --retry-images
```

Skrip tidak mengubah website live atau kode aplikasi dan tidak mengirim formulir. Hasil dan keterbatasan audit terakhir dicatat di `CONTENT-AUDIT.md`.
