const request = require('supertest');
require('./setup');
const app = require('../../src/app');

describe('POST /api/auth/register', () => {
  it('registers a new customer and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('jane@example.com');
    expect(res.body.user.role).toBe('customer');
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects registration with a duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'dupe@example.com',
      password: 'Password123!',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Another Jane',
      email: 'dupe@example.com',
      password: 'Password456!',
    });

    expect(res.status).toBe(409);
  });

  it('rejects registration with missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'noname@example.com' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'login@example.com',
      password: 'Password123!',
    });
  });

  it('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'Password123!',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects login with an incorrect password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'WrongPassword!',
    });

    expect(res.status).toBe(401);
  });

  it('rejects login for a non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'ghost@example.com',
      password: 'Whatever123!',
    });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  it('returns the current user when a valid token is provided', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Me User',
      email: 'me@example.com',
      password: 'Password123!',
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${registerRes.body.token}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('me@example.com');
  });

  it('updates the current user profile', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      name: 'Profile User',
      email: 'profile@example.com',
      password: 'Password123!',
    });

    const res = await request(app)
      .put('/api/auth/me')
      .set('Authorization', `Bearer ${registerRes.body.token}`)
      .send({ name: 'Updated Name' });

    expect(res.status).toBe(200);
    expect(res.body.user.name).toBe('Updated Name');
  });

  it('rejects requests with no token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
