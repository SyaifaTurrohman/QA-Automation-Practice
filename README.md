# QA Automation Practice — Job Application Tracker

Automated end-to-end tests untuk **Job Application Tracker**, sebuah aplikasi web fullstack pribadi (React, Node.js, PostgreSQL, Docker), ditulis dengan **Playwright (JavaScript)**.

Repo ini bagian dari portofolio QA saya. Seluruh test dijalankan terhadap aplikasi buatan sendiri, bukan aplikasi demo.

## Skenario yang Diuji

| Test | Yang diverifikasi |
|---|---|
| Menambahkan lamaran kerja baru | Lamaran muncul di daftar dengan posisi yang benar dan status awal "Applied" |
| Mengubah status lamaran kerja | Dropdown dan stempel status pada card sama-sama ikut berubah |
| Mencari lamaran berdasarkan nama perusahaan | Hasil pencarian terfilter: lamaran yang dicari tampil, lamaran lain hilang |

Ketiganya dijalankan di **Chromium, Firefox, dan WebKit** (total 9 test).

## Praktik yang Diterapkan

- **Page Object Model**: locator dan aksi halaman dikumpulkan di `pages/ApplicationPage.js`, sehingga perubahan UI cukup diperbaiki di satu tempat.
- **Data uji unik**: nama perusahaan dibuat dari timestamp dan kode acak, supaya test yang berjalan paralel tidak saling bentrok.
- **Cleanup otomatis**: `afterEach` menghapus data yang dibuat test, sehingga database tidak menumpuk sampah.
- **Test yang bisa gagal**: test pencarian menambahkan lamaran pembanding dan memastikan lamaran itu hilang setelah pencarian.
- **Locator berbasis user**: memakai `getByRole`, `getByLabel`, dan `getByPlaceholder`, bukan selector yang rapuh.

## Struktur Project

```
├── pages/
│   └── ApplicationPage.js      # Page object
├── tests/
│   └── application-test.spec.js
└── playwright.config.js
```

## Cara Menjalankan

Prasyarat: Node.js terpasang dan aplikasi Job Application Tracker berjalan di `http://localhost:5173` (`docker compose up`, repo aplikasi: [https://github.com/SyaifaTurrohman/job-application-tracker.git]).

```bash
npm install
npx playwright install
npx playwright test
```

Untuk melihat laporan hasil test:

```bash
npx playwright show-report
```

## Catatan

Test ini membutuhkan aplikasi berjalan secara lokal, jadi belum dijalankan di CI.

## Rencana Berikutnya

- API automation untuk endpoint aplikasi
- CI/CD dengan GitHub Actions

## Penulis

[Syaifa Turrohman] — [https://www.linkedin.com/in/syaifa-turrohman/]
