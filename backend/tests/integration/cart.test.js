const request = require('supertest');
require('./setup');
const app = require('../../src/app');
const prisma = require('../../src/lib/prisma');

async function registerAndLogin() {
  const email = `cart-user-${Date.now()}-${Math.random()}@example.com`;
  const res = await request(app).post('/api/auth/register').send({
    name: 'Cart User',
    email,
    password: 'Password123!',
  });
  return res.body.token;
}

describe('Cart endpoints', () => {
  it('rejects all cart routes when unauthenticated', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.status).toBe(401);
  });

  it('adds an item to the cart', async () => {
    const token = await registerAndLogin();
    const product = await prisma.product.create({ data: { name: 'Cart Item', category: 'misc', price: 10 } });

    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 2 });

    expect(res.status).toBe(201);
    expect(res.body.cartItem.quantity).toBe(2);
  });

  it('increments quantity when adding the same product twice', async () => {
    const token = await registerAndLogin();
    const product = await prisma.product.create({ data: { name: 'Repeat Item', category: 'misc', price: 10 } });

    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 1 });

    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 3 });

    expect(res.status).toBe(201);
    expect(res.body.cartItem.quantity).toBe(4);
  });

  it('returns 404 when adding a non-existent product', async () => {
    const token = await registerAndLogin();
    const res = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: 99999, quantity: 1 });

    expect(res.status).toBe(404);
  });

  it('calculates the correct cart total', async () => {
    const token = await registerAndLogin();
    const productA = await prisma.product.create({ data: { name: 'A', category: 'misc', price: 10 } });
    const productB = await prisma.product.create({ data: { name: 'B', category: 'misc', price: 5 } });

    await request(app).post('/api/cart').set('Authorization', `Bearer ${token}`).send({ productId: productA.id, quantity: 2 });
    await request(app).post('/api/cart').set('Authorization', `Bearer ${token}`).send({ productId: productB.id, quantity: 3 });

    const res = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.total).toBe('35.00'); // (10*2) + (5*3)
  });

  it('updates a cart item quantity', async () => {
    const token = await registerAndLogin();
    const product = await prisma.product.create({ data: { name: 'Update Item', category: 'misc', price: 10 } });

    const addRes = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 1 });

    const res = await request(app)
      .put(`/api/cart/${addRes.body.cartItem.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.status).toBe(200);
    expect(res.body.cartItem.quantity).toBe(5);
  });

  it('removes a cart item', async () => {
    const token = await registerAndLogin();
    const product = await prisma.product.create({ data: { name: 'Remove Item', category: 'misc', price: 10 } });

    const addRes = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 1 });

    const deleteRes = await request(app)
      .delete(`/api/cart/${addRes.body.cartItem.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get('/api/cart').set('Authorization', `Bearer ${token}`);
    expect(getRes.body.items).toHaveLength(0);
  });

  it('does not allow a user to modify another user\'s cart item', async () => {
    const tokenA = await registerAndLogin();
    const tokenB = await registerAndLogin();
    const product = await prisma.product.create({ data: { name: 'Isolated Item', category: 'misc', price: 10 } });

    const addRes = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ productId: product.id, quantity: 1 });

    const res = await request(app)
      .delete(`/api/cart/${addRes.body.cartItem.id}`)
      .set('Authorization', `Bearer ${tokenB}`);

    expect(res.status).toBe(404);
  });
});
