import {test, expect} from '@playwright/test';
import {ApplicationPage} from '../pages/ApplicationPage.js';

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

  test.afterEach(async ({ page }) => {
    await appPage.clearSearch();

    for (const name of createdCompanies) {

      if((await appPage.cardFor(name).count()) > 0) {
      await appPage.deleteApplication(name);
    }
  }
  });

  test('menambahkan lamaran kerja baru', async ({ page }) => {
    const card = appPage.cardFor(companyName);

    await expect(card).toBeVisible();
    await expect(card).toContainText('Software Engineer');
    await expect(card.locator('.stamp')).toHaveText('Applied');
  });

  test('mengubah status lamaran kerja', async ({ page }) => {
    
    await appPage.changeStatus(companyName, 'INTERVIEW');

    const card = appPage.cardFor(companyName);
    const statusDropdown = card.getByRole('combobox');

    await expect(statusDropdown).toHaveValue('INTERVIEW');
    await expect(card.locator('.stamp')).toHaveText('Interview');
  });

  test('mencari lamaran kerja berdasarkan nama perusahaan', async ({ page }) => {
   
    const secondCompany = uniqueName('PT Toko Media');
    createdCompanies.push(secondCompany);

    await appPage.addApplication(secondCompany, 'Frontend Dev');

    
    await expect(appPage.cardFor(companyName)).toBeVisible();
    await expect(appPage.cardFor(secondCompany)).toBeVisible();

    
    await appPage.search(companyName);

    
    await expect(appPage.cardFor(companyName)).toBeVisible();
    await expect(appPage.cardFor(secondCompany)).toBeHidden();
  });
});