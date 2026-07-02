import { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import ItemCard, { CATEGORY_LABELS } from '../components/ItemCard';

const CATEGORIES = Object.entries(CATEGORY_LABELS);

export default function Items() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category: '', status: '', search: '' });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      const { data } = await client.get('/items', { params });
      setItems(data.items);
    } catch (err) {
      console.error('Failed to fetch items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, [filters.type, filters.category, filters.status]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleToggleStatus = async (id, status) => {
    try {
      await client.patch(`/items/${id}/status`, { status });
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await client.delete(`/items/${id}`);
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1 className="page-title">Browse Lost & Found Items</h1>
        <p className="page-description">Search and filter through all reported items</p>
      </div>

      <div className="filter-bar">
        <select value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="lost">🔴 Lost</option>
          <option value="found">🟢 Found</option>
        </select>

        <select value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          {CATEGORIES.map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>

        <select value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Statuses</option>
          <option value="pending">⏳ Pending</option>
          <option value="recovered">🎉 Recovered</option>
        </select>

        <form onSubmit={handleSearch} className="search-group">
          <input
            placeholder="Search by title, description, or location..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <button type="submit" className="btn btn-primary btn-sm">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <p>No items found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
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
  );
}
