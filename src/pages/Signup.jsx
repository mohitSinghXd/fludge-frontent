import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 20px' }}>
      <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: 420 }}>
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Join our community to report and recover items</p>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="form-input" placeholder="John Doe" />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required
            className="form-input" placeholder="john@example.com" />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange}
            required minLength={6} className="form-input" placeholder="Min 6 characters" />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%' }}>
          {submitting ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="form-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
