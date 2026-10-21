import { test, expect } from '@playwright/test';

const API = 'http://localhost:5000/api';

test.describe('API Lamaran Kerja', () => {
  let createdIds;

  test.beforeEach(() => {
    createdIds = [];
  });

  // Hapus semua lamaran yang dibuat test (tanpa assertion, karena ini hanya cleanup)
  test.afterEach(async ({ request }) => {
    for (const id of createdIds) {
      await request.delete(`${API}/applications/${id}`);
    }
  });

  // Helper: buat lamaran lewat API dan catat id-nya untuk cleanup
  async function createApplication(request, position = 'QA Engineer') {
    const company = `API Test ${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const response = await request.post(`${API}/applications`, {
      data: { company, position },
    });
    expect(response.ok()).toBe(true);

    const body = await response.json();
    createdIds.push(body.id);
    return body;
  }

  test('GET /applications mengembalikan daftar lamaran', async ({ request }) => {
    const response = await request.get(`${API}/applications`);

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('POST /applications membuat lamaran baru dengan status awal APPLIED', async ({ request }) => {
    const created = await createApplication(request);

    expect(created.id).toBeDefined();
    expect(created.company).toContain('API Test');
    expect(created.position).toBe('QA Engineer');
    expect(created.status).toBe('APPLIED');
  });

  test('PUT /applications/:id mengubah status lamaran', async ({ request }) => {
    const created = await createApplication(request);

    const response = await request.put(`${API}/applications/${created.id}`, {
      data: { status: 'INTERVIEW' },
    });
    expect(response.ok()).toBe(true);

    // Verifikasi dari sumber lain: ambil ulang lewat GET, jangan hanya percaya response PUT
    const list = await (await request.get(`${API}/applications`)).json();
    const found = list.find((a) => a.id === created.id);
    expect(found.status).toBe('INTERVIEW');
  });

  test('DELETE /applications/:id menghapus lamaran', async ({ request }) => {
    const created = await createApplication(request);

    const response = await request.delete(`${API}/applications/${created.id}`);
    expect(response.status()).toBe(204);

    const list = await (await request.get(`${API}/applications`)).json();
    expect(list.some((a) => a.id === created.id)).toBe(false);
  });

  test('GET /applications/:id dengan id bukan angka ditolak sebagai error klien', async ({ request }) => {
    // Bug yang sudah diketahui: saat ini server mengembalikan 500
    test.fail();

    const response = await request.get(`${API}/applications/abc`);

    expect(response.status()).toBeGreaterThanOrEqual(400);
    expect(response.status()).toBeLessThan(500);
  });
});