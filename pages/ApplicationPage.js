export class ApplicationPage {
  constructor(page) {
    this.page = page;

    // Locator elemen yang bersifat tetap
    this.companyInput = page.getByLabel('Company');
    this.positionInput = page.getByLabel('Position');
    this.submitButton = page.getByRole('button', { name: 'File application' });
    this.searchInput = page.getByPlaceholder('Search by company or position');
    this.confirmDeleteButton = page.locator('.confirm-btn--danger');
  }

  // Locator yang bergantung pada data: card milik perusahaan tertentu
  cardFor(company) {
    return this.page.locator('.app-card').filter({ hasText: company });
  }

  // Aksi-aksi pengguna
  async goto() {
    await this.page.goto('http://localhost:5173/');
  }

  async addApplication(company, position) {
    await this.companyInput.fill(company);
    await this.positionInput.fill(position);
    await this.submitButton.click();
  }

  async changeStatus(company, status) {
    await this.cardFor(company).getByRole('combobox').selectOption(status);
  }

  async search(text) {
    await this.searchInput.fill(text);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async deleteApplication(company) {
    const card = this.cardFor(company);
    await card.getByRole('button', { name: 'Remove' }).click();
    await this.confirmDeleteButton.click();
    // Tunggu sampai card benar-benar hilang dari halaman
    await card.waitFor({ state: 'detached' });
  }
}