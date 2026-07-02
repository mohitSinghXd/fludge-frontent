import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/ItemCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [loadingMy, setLoadingMy] = useState(true);
  const [loadingAll, setLoadingAll] = useState(true);

  const fetchMyItems = async () => {
    setLoadingMy(true);
    try {
      const { data } = await client.get('/items/my');
      setMyItems(data.items);
    } catch (err) {
      console.error('Failed to fetch my items', err);
    } finally {
      setLoadingMy(false);
    }
  };

  const fetchAllItems = async () => {
    setLoadingAll(true);
    try {
      const { data } = await client.get('/items');
      setAllItems(data.items);
    } catch (err) {
      console.error('Failed to fetch all items', err);
    } finally {
      setLoadingAll(false);
    }
  };

  useEffect(() => {
    fetchMyItems();
    fetchAllItems();
  }, []);

  const handleToggleStatus = async (id, status) => {
    try {
      await client.patch(`/items/${id}/status`, { status });
      fetchMyItems();
      fetchAllItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await client.delete(`/items/${id}`);
      fetchMyItems();
      fetchAllItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const myPending = myItems.filter(i => i.status === 'pending').length;
  const myRecovered = myItems.filter(i => i.status === 'recovered').length;

  return (
    <div className="page-wrapper">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Welcome back, {user?.name} 👋</h1>
          <p className="page-description">Manage your reported items and browse all listings</p>
        </div>
        <Link to="/report">
          <button className="btn btn-primary">+ Report New Item</button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 36 }}>
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--blue-500)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--blue-600)' }}>{myItems.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>My Reports</div>
        </div>
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--amber-500)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--amber-600)' }}>{myPending}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Pending</div>
        </div>
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--green-500)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--green-600)' }}>{myRecovered}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Recovered</div>
        </div>
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-sm)', borderLeft: '4px solid var(--gray-400)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gray-600)' }}>{allItems.length}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Total Listings</div>
        </div>
      </div>

      {/* My Reported Items Section */}
      <div style={{ marginBottom: 48 }}>
        <h2 className="section-title">📋 My Reported Items</h2>
        {loadingMy ? (
          <div className="loading">Loading your items...</div>
        ) : myItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>You haven't reported any items yet.</p>
            <Link to="/report" style={{ marginTop: 12, display: 'inline-block' }}>
              <button className="btn btn-primary btn-sm">Report Your First Item</button>
            </Link>
          </div>
        ) : (
          <div className="items-grid">
            {myItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isOwner={true}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Public Listings Section */}
      <div>
        <h2 className="section-title">🌐 Public Listings</h2>
        {loadingAll ? (
          <div className="loading">Loading all listings...</div>
        ) : allItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p>No items have been reported yet.</p>
          </div>
        ) : (
          <div className="items-grid">
            {allItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isOwner={user && item.reportedBy?._id === user.id}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
