import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          Lost & Found
        </Link>

        <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links${mobileOpen ? ' open' : ''}`}>
          <Link to="/items" className={isActive('/items')} onClick={() => setMobileOpen(false)}>
            Browse Items
          </Link>
          {user ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              <Link to="/report" className={isActive('/report')} onClick={() => setMobileOpen(false)}>
                Report Item
              </Link>
              <div className="nav-user">
                <div className="nav-avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="nav-user-name">{user.name}</span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')} onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)}>
                <button className="btn btn-primary btn-sm">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
