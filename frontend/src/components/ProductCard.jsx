import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='160' viewBox='0 0 220 160'%3E%3Crect width='220' height='160' fill='%23e5e5e5'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-family='sans-serif' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = React.useState('idle');

  const apiOrigin = process.env.REACT_APP_API_ORIGIN || 'http://localhost:5000';
  const resolveImageSrc = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    if (/^https?:\/\//i.test(url)) return url;
    return `${apiOrigin}${url}`;
  };
  const imageSrc = resolveImageSrc(product.imageUrl);

  const handleAddToCart = async () => {
    setStatus('loading');
    const result = await addItem(product.id, 1);
    setStatus(result.success ? 'success' : 'error');
  };

  return (
    <div className="product-card" data-testid={`product-card-${product.id}`}>
      <Link to={`/products/${product.id}`} className="product-card-link">
        <img
          src={imageSrc}
          alt={product.name}
          className="product-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        <h3>{product.name}</h3>
        <p className="price">${parseFloat(product.price).toFixed(2)}</p>
        <p className="category">{product.category}</p>
      </Link>

      {isAuthenticated ? (
        <button onClick={handleAddToCart} disabled={status === 'loading'}>
          {status === 'loading' ? 'Adding...' : 'Add to Cart'}
        </button>
      ) : (
        <Link to="/login">Log in to purchase</Link>
      )}

      {status === 'error' && <p role="alert">Could not add item to cart.</p>}
      {status === 'success' && <p role="status">Added to cart!</p>}
    </div>
  );
}