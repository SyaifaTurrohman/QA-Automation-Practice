import { test, expect } from '@playwright/test';
import { ApplicationPage } from '../pages/ApplicationPage.js';

const API = 'http://localhost:5000/api';

const uniqueName = (prefix) =>
  `${prefix} ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

test.describe('Manajemen Lamaran Kerja', () => {
  let appPage;
  let companyName;
  let createdCompanies;

  test.beforeEach(async ({ page }) => {
    appPage = new ApplicationPage(page);
    createdCompanies = [];
    companyName = uniqueName('PT Qtera');
    createdCompanies.push(companyName);

    await appPage.goto();
    await appPage.addApplication(companyName, 'Software Engineer');
  });

  // Cleanup lewat API: lebih cepat dan tidak bergantung pada tampilan.
  // Lamaran dibuat lewat UI, jadi id-nya dicari dulu berdasarkan nama perusahaan yang unik.
  test.afterEach(async ({ request }) => {
    const list = await (await request.get(`${API}/applications`)).json();

    for (const name of createdCompanies) {
      const match = list.find((a) => a.company === name);
      if (match) {
        await request.delete(`${API}/applications/${match.id}`);
      }
    }
  });

  test('menambahkan lamaran kerja baru', async () => {
    const card = appPage.cardFor(companyName);

    await expect(card).toBeVisible();
    await expect(card).toContainText('Software Engineer');
    await expect(card.locator('.stamp')).toHaveText('Applied');
  });

  test('mengubah status lamaran kerja', async () => {
    await appPage.changeStatus(companyName, 'INTERVIEW');

    const card = appPage.cardFor(companyName);

    await expect(card.getByRole('combobox')).toHaveValue('INTERVIEW');
    await expect(card.locator('.stamp')).toHaveText('Interview');
  });

  test('mencari lamaran kerja berdasarkan nama perusahaan', async () => {
    // Lamaran kedua sebagai pembanding yang harus hilang saat search
    const secondCompany = uniqueName('PT Toko Media');
    createdCompanies.push(secondCompany);

    await appPage.addApplication(secondCompany, 'Frontend Dev');

    // Sebelum search: keduanya tampil
    await expect(appPage.cardFor(companyName)).toBeVisible();
    await expect(appPage.cardFor(secondCompany)).toBeVisible();

    await appPage.search(companyName);

    // Sesudah search: yang dicari tampil, yang lain hilang
    await expect(appPage.cardFor(companyName)).toBeVisible();
    await expect(appPage.cardFor(secondCompany)).toBeHidden();
  });
});