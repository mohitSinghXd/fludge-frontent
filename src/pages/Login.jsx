import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 20px' }}>
      <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: 420 }}>
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Sign in to manage your reports</p>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required
            className="form-input" placeholder="john@example.com" />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange}
            required className="form-input" placeholder="Your password" />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%' }}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>

        <p className="form-footer">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}
