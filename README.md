# QA Automation Practice — Job Application Tracker

[![Playwright Tests](https://github.com/SyaifaTurrohman/QA-Automation-Practice/actions/workflows/playwright.yml/badge.svg)](https://github.com/SyaifaTurrohman/QA-Automation-Practice/actions/workflows/playwright.yml)

Automated UI dan API tests untuk **Job Application Tracker**, aplikasi web fullstack pribadi (React, Node.js, PostgreSQL, Docker), ditulis dengan **Playwright (JavaScript)**. Test berjalan otomatis di GitHub Actions pada setiap push.

- Repo aplikasi: [job-application-tracker](https://github.com/SyaifaTurrohman/job-application-tracker)
- Dokumen pengujian manual dan API (bug report, test plan, test summary): [qa-portfolio](https://github.com/SyaifaTurrohman/QA-Portofolio.git)

## Skenario yang Diuji

### UI (3 test, dijalankan di Chromium, Firefox, dan WebKit = 9 eksekusi)

| Test | Yang diverifikasi |
|---|---|
| Menambahkan lamaran kerja baru | Lamaran muncul dengan posisi yang benar dan status awal "Applied" |
| Mengubah status lamaran kerja | Dropdown dan stempel status pada card sama-sama ikut berubah |
| Mencari lamaran berdasarkan nama perusahaan | Hasil terfilter: lamaran yang dicari tampil, lamaran lain hilang |

### API (9 test)

| Kategori | Yang diverifikasi |
|---|---|
| Skenario normal | GET daftar, POST membuat lamaran (status awal APPLIED), PUT mengubah status (diverifikasi ulang lewat GET), DELETE menghapus lamaran (204) |
| Skenario negatif | Id angka yang tidak ada (404), POST body kosong (400), status tidak valid tidak mengubah data |
| Bug yang diketahui | Id bukan angka dan status di luar enum menghasilkan 500, padahal seharusnya error klien (4xx) |

Dua test terakhir ditandai `test.fail()`, sehingga suite tetap hijau dan test akan melaporkan perubahan begitu bug diperbaiki. Detail bug (BUG-JAT-002 dan BUG-JAT-003) ada di repo [qa-portfolio](https://github.com/SyaifaTurrohman/QA-Portofolio.git).

## Praktik yang Diterapkan

- **Page Object Model**: locator dan aksi halaman dikumpulkan di `pages/ApplicationPage.js`.
- **Data uji unik**: nama dibuat dari timestamp dan kode acak, supaya test paralel tidak bentrok.
- **Cleanup lewat API**: data yang dibuat test dihapus dengan `DELETE`, lebih cepat dan tidak bergantung pada tampilan.
- **Test yang bisa gagal**: test pencarian memverifikasi bahwa lamaran pembanding benar-benar hilang.
- **Verifikasi dari sumber lain**: hasil `PUT` dicek ulang lewat `GET`, bukan hanya dari response-nya.
- **Project terpisah**: test API berjalan sekali, test UI berjalan di tiga browser.

## CI/CD

Workflow GitHub Actions (`.github/workflows/playwright.yml`):

1. Mengambil kode test dan kode aplikasi
2. Menjalankan aplikasi dengan `docker compose up --build`
3. Menunggu backend dan frontend benar-benar merespons
4. Menjalankan seluruh test
5. Menyimpan laporan HTML sebagai artifact, dan menampilkan log aplikasi jika gagal

## Struktur Project

```
├── .github/workflows/playwright.yml
├── pages/
│   └── ApplicationPage.js
├── tests/
│   ├── application-test.spec.js   # test UI
│   └── api.spec.js                # test API
└── playwright.config.js
```

## Cara Menjalankan Lokal

Prasyarat: Node.js, dan aplikasi Job Application Tracker berjalan (`docker compose up`) di `http://localhost:5173` dengan backend di `http://localhost:5000`.

```bash
npm install
npx playwright install

npx playwright test                      # semua test
npx playwright test --project=api       # test API saja
npx playwright test --project=chromium  # test UI di satu browser
npx playwright show-report              # buka laporan HTML
```

## Penulis

SYAIFA TURROHMAN — https://www.linkedin.com/in/syaifa-turrohman/