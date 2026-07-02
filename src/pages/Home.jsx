import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      <section className="hero">
        <h1 className="hero-title">Lost Something?<br />Found Something?</h1>
        <p className="hero-sub">
          Report lost or found items and help reunite people with their belongings.
          Browse listings, post reports, and connect with your community.
        </p>
        <div className="hero-buttons">
          <Link to="/items"><button className="btn btn-primary">Browse Items</button></Link>
          {user ? (
            <Link to="/report"><button className="btn btn-outline">Report an Item</button></Link>
          ) : (
            <Link to="/signup"><button className="btn btn-outline">Get Started Free</button></Link>
          )}
        </div>
      </section>

      <div className="page-wrapper">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📢</div>
            <h3>Report Lost Items</h3>
            <p>Quickly post details about items you've lost with location, category, and contact info.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Post Found Items</h3>
            <p>Found something? Let the owner know by posting it here with an image and description.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Reconnect & Recover</h3>
            <p>Browse listings, filter by category, and reach out directly via email to claim your items.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
