import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { CATEGORY_LABELS } from '../components/ItemCard';

const CATEGORIES = Object.entries(CATEGORY_LABELS);

export default function ReportItem() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'lost',
    category: 'others',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactEmail: user?.email || '',
    contactPhone: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('category', form.category);
      formData.append('location', form.location);
      formData.append('date', new Date(form.date).toISOString());
      formData.append('contactEmail', form.contactEmail || user?.email);
      formData.append('contactPhone', form.contactPhone);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await client.post('/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report item');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 20px' }}>
      <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: 640 }}>
        <h2 className="form-title">Report an Item</h2>
        <p className="form-subtitle">Fill in the details to help find or return an item</p>

        {error && <div className="form-error">{error}</div>}

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="form-input">
              <option value="lost">🔴 Lost</option>
              <option value="found">🟢 Found</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="form-input">
              {CATEGORIES.map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Title</label>
          <input name="title" value={form.title} onChange={handleChange} required
            className="form-input" placeholder="e.g. Blue Backpack, Golden Retriever" />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required
            rows={3} className="form-input" style={{ resize: 'vertical' }}
            placeholder="Provide detailed description — color, size, distinguishing features..." />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input name="location" value={form.location} onChange={handleChange} required
              className="form-input" placeholder="Where it was lost/found" />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input name="date" type="date" value={form.date} onChange={handleChange} required
              className="form-input" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Item Image (optional)</label>
          <input
            type="file"
            ref={fileRef}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          {imagePreview ? (
            <div className="image-upload-area has-image" onClick={() => fileRef.current?.click()}>
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <div style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-sm btn-ghost" onClick={(e) => { e.stopPropagation(); removeImage(); }}>
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            <div className="image-upload-area" onClick={() => fileRef.current?.click()}>
              <div className="upload-icon">📷</div>
              <div className="upload-text">Click to upload an image</div>
              <div className="upload-hint">JPEG, PNG, GIF, or WebP — max 5MB</div>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange}
              required className="form-input" placeholder={user?.email || 'your@email.com'} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
              className="form-input" placeholder="+1234567890" />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: 4 }}>
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}
