import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders a search input', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    expect(screen.getByLabelText(/search term/i)).toBeInTheDocument();
  });

  it('calls onSearch with the trimmed input value as the user types', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);

    await user.type(screen.getByLabelText(/search term/i), 'shoes');

    expect(handleSearch).toHaveBeenLastCalledWith('shoes');
  });

  it('pre-fills the input from initialValue', () => {
    render(<SearchBar onSearch={jest.fn()} initialValue="boots" />);
    expect(screen.getByLabelText(/search term/i)).toHaveValue('boots');
  });
});