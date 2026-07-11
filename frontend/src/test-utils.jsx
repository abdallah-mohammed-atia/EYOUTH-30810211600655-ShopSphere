import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

export function renderWithProviders(ui, { route = '/' } = {}) {
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );
  }
  return render(ui, { wrapper: Wrapper });
}

export * from '@testing-library/react';
