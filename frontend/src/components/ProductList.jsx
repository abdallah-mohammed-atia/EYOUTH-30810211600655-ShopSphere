import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as productApi from '../api/productApi';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';

const CATEGORY_OPTIONS = ['feetwear', 'electronics', 'gaming', 'clothes'];

export default function ProductList() {
  const [filters, setFilters] = useState({ search: '', category: '', sortBy: 'createdAt', order: 'ASC', page: 1 });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.getProducts(filters),
    keepPreviousData: true,
    retry: false,
  });

  const products = data?.items ?? [];
  const pagination = data?.pagination ?? { page: 1, totalPages: 1 };
  const errorMessage = 'Unable to load products. Please try again later.';

  const categories = CATEGORY_OPTIONS;

  const handleSearch = (term) => {
    setFilters((prev) => ({ ...prev, search: term, page: 1 }));
  };

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value, page: 1 }));
  };

  const handleOrderToggle = () => {
    setFilters((prev) => ({ ...prev, order: prev.order === 'ASC' ? 'DESC' : 'ASC', page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="product-list">
      <SearchBar onSearch={handleSearch} initialValue={filters.search} />

      <div className="product-controls">
        <label htmlFor="category-select">
          Category:
          <select
            id="category-select"
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value, page: 1 }))}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="sort-select">
          Sort by:
          <select id="sort-select" value={filters.sortBy} onChange={handleSortChange}>
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </label>

        <button type="button" className="button button-secondary sort-toggle" onClick={handleOrderToggle}>
          {filters.order === 'ASC' ? 'Ascending' : 'Descending'}
        </button>
      </div>

      {isLoading && <p role="status">Loading products...</p>}
      {isError && <p role="alert">{errorMessage}</p>}

      {!isLoading && !isError && products.length === 0 && <p>No products found.</p>}

      {!isLoading && !isError && products.length > 0 && (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="pagination" aria-label="Pagination">
            <button
              disabled={pagination.page <= 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

    </div>
  );
}
