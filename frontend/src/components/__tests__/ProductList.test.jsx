import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../../mocks/server';
import { renderWithProviders } from '../../test-utils';
import ProductList from '../ProductList';

const API_URL = 'http://localhost:5000/api';

describe('ProductList', () => {
  it('shows a loading state and then renders products from the API', async () => {
    renderWithProviders(<ProductList />);

    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);

    expect(await screen.findByText('Running Shoes')).toBeInTheDocument();
    expect(screen.getByText('Hiking Boots')).toBeInTheDocument();
    expect(screen.getByText('Cotton T-Shirt')).toBeInTheDocument();
  });

  it('filters products when a search is performed', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductList />);

    await screen.findByText('Running Shoes');

    await user.type(screen.getByLabelText(/search term/i), 'Hiking');
    await waitFor(() => {
      expect(screen.queryByText('Running Shoes')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Hiking Boots')).toBeInTheDocument();
  });

  it('toggles sort direction when the sort button is clicked', async () => {
    const user = userEvent.setup();
    let lastOrder = null;

    server.use(
      rest.get(`${API_URL}/products`, (req, res, ctx) => {
        lastOrder = req.url.searchParams.get('order');
        return res(
          ctx.json({
            items: [{ id: 1, name: 'Running Shoes', price: 100, category: 'Shoes' }],
            pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
          })
        );
      })
    );

    renderWithProviders(<ProductList />);

    await screen.findByText('Running Shoes');
    expect(lastOrder).toBe('ASC');

    await user.click(screen.getByRole('button', { name: /ascending/i }));

    await waitFor(() => {
      expect(lastOrder).toBe('DESC');
    });
    expect(screen.getByRole('button', { name: /descending/i })).toBeInTheDocument();
  });

  it('shows an error message when the API request fails', async () => {
    server.use(
      rest.get(`${API_URL}/products`, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );

    renderWithProviders(<ProductList />);

    expect(await screen.findByRole('alert')).toHaveTextContent(/unable to load products/i);
  });

  it('shows an empty state when no products are returned', async () => {
    server.use(
      rest.get(`${API_URL}/products`, (req, res, ctx) => {
        return res(
          ctx.json({ items: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } })
        );
      })
    );

    renderWithProviders(<ProductList />);

    expect(await screen.findByText(/no products found/i)).toBeInTheDocument();
  });
});
