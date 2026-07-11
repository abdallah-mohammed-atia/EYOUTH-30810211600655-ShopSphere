import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  it('renders an input and a submit button', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    expect(screen.getByLabelText(/search term/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('calls onSearch with the trimmed input value on submit', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);

    await user.type(screen.getByLabelText(/search term/i), '  running shoes  ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(handleSearch).toHaveBeenCalledWith('running shoes');
  });

  it('pre-fills the input from initialValue', () => {
    render(<SearchBar onSearch={jest.fn()} initialValue="boots" />);
    expect(screen.getByLabelText(/search term/i)).toHaveValue('boots');
  });
});
