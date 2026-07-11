import React, { useEffect, useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [term, setTerm] = useState(initialValue);

  useEffect(() => {
    setTerm(initialValue);
  }, [initialValue]);

  const handleChange = (e) => {
    const nextTerm = e.target.value;
    setTerm(nextTerm);
    onSearch(nextTerm.trim());
  };

  return (
    <form className="search-bar" role="search" aria-label="Search products">
      <input
        className="search-input"
        type="text"
        placeholder="Search products..."
        value={term}
        onChange={handleChange}
        aria-label="Search term"
      />
    </form>
  );
}
