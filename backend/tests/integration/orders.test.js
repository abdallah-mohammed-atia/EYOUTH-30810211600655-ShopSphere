const request = require('supertest');
require('./setup');
const app = require('../../src/app');
const prisma = require('../../src/lib/prisma');

async function registerAndLogin() {
  const email = `order-${Date.now()}-${Math.random()}@example.com`;
  const res = await request(app).post('/api/auth/register').send({
    name: 'Order User',
    email,
    password: 'Password123!',
  });
  return res.body.token;
}

describe('Order API', () => {
  let token;
  let product;

  beforeEach(async () => {
    token = await registerAndLogin();
    product = await prisma.product.create({ data: { name: 'Order Item', category: 'orders', price: 19.99, stock: 10 } });
  });

  it('creates an order from the cart and empties the cart', async () => {
    await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product.id, quantity: 2 });

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.total).toBe('39.98');
    expect(res.body.order.items).toHaveLength(1);
    expect(res.body.order.items[0].quantity).toBe(2);

    const cartRes = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(cartRes.status).toBe(200);
    expect(cartRes.body.items).toHaveLength(0);
  });

  it('returns 400 when there is no cart content', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});
