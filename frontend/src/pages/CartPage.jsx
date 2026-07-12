import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, total, loading, error, refreshCart, updateItem, removeItem } = useCart();
const navigate = useNavigate();
const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const [discountCode, setDiscountCode] = useState('');

  const discountedTotal = useMemo(() => {
    const subtotal = Number(total) || 0;
    if (discountCode.trim().toLowerCase() === 'save10') {
      return Math.max(subtotal - 10, 0).toFixed(2);
    }
    return subtotal.toFixed(2);
  }, [discountCode, total]);

  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p role="status">Loading your cart...</p>;
  if (error) return <p role="alert">{error}</p>;

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id} data-testid={`cart-item-${item.id}`}>
            <span>{item.Product?.name}</span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              aria-label={`Quantity for ${item.Product?.name}`}
              onChange={(e) => updateItem(item.id, Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
            <span>${(parseFloat(item.Product?.price || 0) * item.quantity).toFixed(2)}</span>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <p className="cart-total">Total: ${total}</p>
      <button type="button" className="button" onClick={() => setIsCheckoutOpen(true)}>
        Checkout
      </button>

      {isCheckoutOpen && (
        <div className="checkout-modal" role="dialog" aria-modal="true">
          <div className="checkout-modal-card">
            <h2>Checkout Summary</h2>
            <ul>
              {items.map((item) => (
                <li key={`checkout-${item.id}`}>
                  <span>{item.Product?.name}</span>
                  <span>{item.quantity} × ${parseFloat(item.Product?.price || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <label htmlFor="discount-code">Discount code</label>
            <input
              id="discount-code"
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Try save10"
            />
            <p className="cart-total">Subtotal: ${Number(total).toFixed(2)}</p>
            <p className="cart-total">Discounted total: ${discountedTotal}</p>
            <div className="checkout-actions">
  <button type="button" className="button button-secondary" onClick={() => setIsCheckoutOpen(false)}>
    Close
  </button>
  <button
    type="button"
    className="button"
    onClick={() => {
      setIsCheckoutOpen(false);
      setIsOrderPlaced(true);
    }}
  >
    Place Order
  </button>
</div>
          </div>
        </div>
      )}
      {isOrderPlaced && (
  <div className="checkout-modal" role="dialog" aria-modal="true">
    <div className="checkout-modal-card order-success-card">
      <h2 className="order-success-title">Thanks for Shopping!</h2>
      <p className="order-success-message">
        Your order has been placed successfully. We hope you enjoy your new items!
      </p>
      <button
  type="button"
  className="button order-success-button"
  onClick={() => {
    setIsOrderPlaced(false);
    navigate('/');
  }}
>
  Continue Shopping
</button>
      
    </div>
  </div>
)}
      
    </div>
  );
}

