import "./ProductDetailPage.css";
import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as productApi from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='160' viewBox='0 0 220 160'%3E%3Crect width='220' height='160' fill='%23e5e5e5'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addItem } = useCart();
  const { isAuthenticated, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [addStatus, setAddStatus] = useState('idle');
  const [priceInput, setPriceInput] = useState('');
  const [adminStatus, setAdminStatus] = useState('idle');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id),
    enabled: Boolean(id),
    retry: false,
  });

  const product = data?.product ?? null;

  useEffect(() => {
    if (product) {
      setPriceInput(String(product.price ?? ''));
    }
  }, [product]);

  const handleAddToCart = async () => {
    setAddStatus('loading');
    const result = await addItem(product.id, quantity);
    setAddStatus(result?.success ? 'success' : 'error');
  };

  const handlePriceUpdate = async () => {
    const numericPrice = parseFloat(priceInput);
    if (!product || Number.isNaN(numericPrice)) {
      setAdminStatus('error');
      return;
    }

    setAdminStatus('loading');
    try {
      const updated = await productApi.updateProduct(product.id, { price: numericPrice });
      queryClient.setQueryData(['product', id], (previousData) =>
        previousData
          ? {
              ...previousData,
              product: updated.product || { ...(previousData.product || product), price: numericPrice },
            }
          : previousData
      );
      setAdminStatus('success');
    } catch (err) {
      setAdminStatus('error');
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    setAdminStatus('loading');
    try {
      await productApi.deleteProduct(product.id);
      queryClient.removeQueries({ queryKey: ['product', id] });
      setAdminStatus('success');
    } catch (err) {
      setAdminStatus('error');
    }
  };

  if (isLoading) return <p role="status">Loading...</p>;
  if (isError) {
    const message = error?.message?.includes('404') ? 'Product not found.' : 'Unable to load this product. Please try again.';
    return <p role="alert">{message}</p>;
  }
  if (!product) return null;

  const apiOrigin = process.env.REACT_APP_API_ORIGIN || 'http://localhost:5000';
  const resolveImageSrc = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    if (/^https?:\/\//i.test(url)) return url;
    return `${apiOrigin}${url}`;
  };
  const imageSrc = resolveImageSrc(product.imageUrl);

  return (
    <div className="product-detail">
      <div className="product-detail-grid">
        <img
          src={imageSrc}
          alt={product.name}
          className="product-detail-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />

        <div className="product-detail-info">
          <span className="product-detail-badge">
            {product.category || 'Product'}
          </span>

          <h1>{product.name}</h1>
          <p className="price">${parseFloat(product.price).toFixed(2)}</p>
          <p>{product.description}</p>

          <div className="product-detail-meta">
            <span>In stock: <strong>{product.stock}</strong></span>
            {product.brand && <span>Brand: {product.brand}</span>}
          </div>

          {isAuthenticated ? (
            <div className="product-detail-actions">
              <label htmlFor="quantity">Quantity</label>
              <div className="quantity-field">
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  className="quantity-input"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                />
              </div>

              <button
                className="button product-detail-button"
                onClick={handleAddToCart}
                disabled={addStatus === 'loading'}
              >
                {addStatus === 'loading' ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          ) : (
            <p className="product-detail-note">Please log in to purchase this item.</p>
          )}

          {isAdmin && (
            <div className="admin-product-actions">
              <label htmlFor="price-edit">Adjust price</label>
              <div className="admin-price-row">
                <input
                  id="price-edit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="quantity-input"
                />
                <button className="button button-secondary" onClick={handlePriceUpdate}>
                  Save Price
                </button>
              </div>
              <button className="button delete-button" onClick={handleDelete}>
                Delete Product
              </button>
            </div>
          )}

          {addStatus === 'success' && <p role="status">Added to cart!</p>}
          {addStatus === 'error' && <p role="alert">Could not add item to cart.</p>}
          {adminStatus === 'success' && <p role="status">Action completed.</p>}
          {adminStatus === 'error' && <p role="alert">Action failed. Please try again.</p>}
        </div>
      </div>
    </div>
  );
}
