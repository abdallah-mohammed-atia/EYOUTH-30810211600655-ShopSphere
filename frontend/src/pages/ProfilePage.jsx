import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    const payload = {
      name: form.name || undefined,
      email: form.email || undefined,
      password: form.password || undefined,
    };

    const result = await updateProfile(payload);
    setSubmitting(false);

    if (result.success) {
      setMessage('Profile updated successfully.');
      setForm((prev) => ({ ...prev, password: '' }));
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <h1>My Profile</h1>
      <p>Manage your account details below.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="profile-name">Name</label>
        <input id="profile-name" name="name" type="text" value={form.name} onChange={handleChange} required />

        <label htmlFor="profile-email">Email</label>
        <input id="profile-email" name="email" type="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="profile-password">New Password</label>
        <input id="profile-password" name="password" type="password" value={form.password} onChange={handleChange} />

        {error && <p role="alert">{error}</p>}
        {message && <p role="status">{message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
