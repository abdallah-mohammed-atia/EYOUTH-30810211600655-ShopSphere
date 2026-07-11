import { rest } from 'msw';

const API_URL = 'http://localhost:5000/api';

export const mockProducts = [
  { id: 1, name: 'Running Shoes', category: 'shoes', price: '59.99', stock: 10, imageUrl: null },
  { id: 2, name: 'Hiking Boots', category: 'shoes', price: '129.99', stock: 5, imageUrl: null },
  { id: 3, name: 'Cotton T-Shirt', category: 'apparel', price: '19.99', stock: 50, imageUrl: null },
];

export const handlers = [
  rest.get(`${API_URL}/products`, (req, res, ctx) => {
    const search = req.url.searchParams.get('search');

    let items = mockProducts;
    if (search) {
      items = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }

    return res(
      ctx.json({
        items,
        pagination: { page: 1, limit: 10, total: items.length, totalPages: 1 },
      })
    );
  }),

  rest.get(`${API_URL}/products/:id`, (req, res, ctx) => {
    const product = mockProducts.find((p) => p.id === Number(req.params.id));
    if (!product) {
      return res(ctx.status(404), ctx.json({ message: 'Product not found.' }));
    }
    return res(ctx.json({ product }));
  }),

  rest.post(`${API_URL}/auth/login`, async (req, res, ctx) => {
    const body = await req.json();
    if (body.email === 'customer@example.com' && body.password === 'Password123!') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'mock-token',
          user: { id: 1, name: 'Test Customer', email: body.email, role: 'customer' },
        })
      );
    }
    return res(ctx.status(401), ctx.json({ message: 'Invalid email or password.' }));
  }),

  rest.get(`${API_URL}/auth/me`, (req, res, ctx) => {
    const auth = req.headers.get('Authorization');
    if (!auth) {
      return res(ctx.status(401), ctx.json({ message: 'Authentication token is required.' }));
    }
    return res(
      ctx.json({
        user: { id: 1, name: 'Test Customer', email: 'customer@example.com', role: 'customer' },
      })
    );
  }),

  rest.post(`${API_URL}/cart`, async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(201),
      ctx.json({ cartItem: { id: 1, productId: body.productId, quantity: body.quantity } })
    );
  }),
];
