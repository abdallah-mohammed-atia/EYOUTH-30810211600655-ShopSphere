const request = require('supertest');
require('./setup');
const app = require('../../src/app');
const { Product } = require('../../src/models');

async function registerAndLogin(role = 'customer') {
  const email = `${role}-${Date.now()}-${Math.random()}@example.com`;
  const res = await request(app).post('/api/auth/register').send({
    name: `${role} user`,
    email,
    password: 'Password123!',
    role,
  });
  return res.body.token;
}

describe('GET /api/products', () => {
  beforeEach(async () => {
    await Product.bulkCreate([
      { name: 'Running Shoes', category: 'shoes', price: 59.99, stock: 10 },
      { name: 'Hiking Boots', category: 'shoes', price: 129.99, stock: 5 },
      { name: 'Cotton T-Shirt', category: 'apparel', price: 19.99, stock: 50 },
    ]);
  });

  it('returns all products with default pagination', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(3);
    expect(res.body.pagination.total).toBe(3);
  });

  it('filters products by category', async () => {
    const res = await request(app).get('/api/products?category=shoes');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
    expect(res.body.items.every((p) => p.category === 'shoes')).toBe(true);
  });

  it('searches products by name', async () => {
    const res = await request(app).get('/api/products?search=Hiking');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe('Hiking Boots');
  });

  it('searches products by category', async () => {
    const res = await request(app).get('/api/products?search=shoes');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
    expect(res.body.items.every((p) => p.category === 'shoes')).toBe(true);
  });

  it('sorts products by price descending', async () => {
    const res = await request(app).get('/api/products?sortBy=price&order=DESC');
    expect(res.status).toBe(200);
    const prices = res.body.items.map((p) => parseFloat(p.price));
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  it('paginates results correctly', async () => {
    const res = await request(app).get('/api/products?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(2);
    expect(res.body.pagination.totalPages).toBe(2);
  });

  it('filters by min and max price', async () => {
    const res = await request(app).get('/api/products?minPrice=20&maxPrice=100');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].name).toBe('Running Shoes');
  });
});

describe('GET /api/products/:id', () => {
  it('returns a single product', async () => {
    const product = await Product.create({ name: 'Solo Item', category: 'misc', price: 9.99 });
    const res = await request(app).get(`/api/products/${product.id}`);
    expect(res.status).toBe(200);
    expect(res.body.product.name).toBe('Solo Item');
  });

  it('returns 404 for a non-existent product', async () => {
    const res = await request(app).get('/api/products/99999');
    expect(res.status).toBe(404);
  });
});

describe('POST /api/products (admin only)', () => {
  it('rejects creation when unauthenticated', async () => {
    const res = await request(app).post('/api/products').send({ name: 'X', price: 1, category: 'a' });
    expect(res.status).toBe(401);
  });

  it('rejects creation from a customer account', async () => {
    const token = await registerAndLogin('customer');
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'X', price: 1, category: 'a' });

    expect(res.status).toBe(403);
  });

  it('allows creation from an admin account', async () => {
    const token = await registerAndLogin('admin');
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'New Product')
      .field('price', 25.5)
      .field('category', 'gadgets')
      .field('stock', 10);

    expect(res.status).toBe(201);
    expect(res.body.product.name).toBe('New Product');
  });
});

describe('GET /api/categories', () => {
  it('returns categories and creates them on demand', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });
});

describe('GET /api/admin/stats', () => {
  it('returns aggregate statistics for admins', async () => {
    const token = await registerAndLogin('admin');
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ users: expect.any(Number), products: expect.any(Number) })
    );
  });
});

describe('DELETE /api/products/:id (admin only)', () => {
  it('deletes a product as admin', async () => {
    const token = await registerAndLogin('admin');
    const product = await Product.create({ name: 'To Delete', category: 'misc', price: 5 });

    const res = await request(app)
      .delete(`/api/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
    const found = await Product.findByPk(product.id);
    expect(found).toBeNull();
  });
});
