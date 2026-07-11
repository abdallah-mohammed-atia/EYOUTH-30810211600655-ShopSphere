import React, { useEffect, useState } from 'react';
import * as productApi from '../api/productApi';

const emptyForm = { name: '', description: '', price: '', category: '', stock: '', image: null };

export default function AdminDashboardPage() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadProducts = async () => {
    setStatus('loading');
    try {
      const data = await productApi.getProducts({ limit: 100 });
      setProducts(data.items);
      setStatus('success');
    } catch (err) {
      setError('Failed to load products.');
      setStatus('error');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') formData.append(key, value);
    });

    try {
      await productApi.createProduct(formData);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productApi.deleteProduct(id);
      await loadProducts();
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  const startEdit = (product) => {
    setEditId(product.id);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      stock: product.stock || '',
      image: null,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(emptyForm);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value !== null && value !== '') formData.append(key, value);
      });
      await productApi.updateProduct(editId, formData);
      setEditId(null);
      setEditForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Add New Product</h2>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <input name="image" type="file" accept="image/*" onChange={handleChange} />
          {error && <p role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create Product'}
          </button>
        </form>
      </section>

      <section>
        <h2>Existing Products</h2>
        {status === 'loading' && <p role="status">Loading...</p>}
        {status === 'success' && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${parseFloat(p.price).toFixed(2)}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => startEdit(p)}>Edit</button>
                    <button onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {editId && (
        <section>
          <h2>Edit Product</h2>
          <form onSubmit={submitEdit}>
            <input name="name" placeholder="Name" value={editForm.name} onChange={handleEditChange} required />
            <input name="description" placeholder="Description" value={editForm.description} onChange={handleEditChange} />
            <input name="price" type="number" step="0.01" placeholder="Price" value={editForm.price} onChange={handleEditChange} required />
            <input name="category" placeholder="Category" value={editForm.category} onChange={handleEditChange} required />
            <input name="stock" type="number" placeholder="Stock" value={editForm.stock} onChange={handleEditChange} />
            <input name="image" type="file" accept="image/*" onChange={handleEditChange} />
            <div>
              <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={cancelEdit}>Cancel</button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
