import { getImageUrl } from '../api/client';

const CATEGORY_LABELS = {
  electronics: 'Electronics',
  pets: 'Pets',
  documents: 'Documents',
  personal_belongings: 'Personal Belongings',
  keys: 'Keys',
  clothing: 'Clothing',
  accessories: 'Accessories',
  bags: 'Bags',
  wallets: 'Wallets',
  jewelry: 'Jewelry',
  sports_equipment: 'Sports Equipment',
  musical_instruments: 'Musical Instruments',
  toys: 'Toys',
  books: 'Books',
  others: 'Others',
};

const CATEGORY_ICONS = {
  electronics: '💻',
  pets: '🐾',
  documents: '📄',
  personal_belongings: '👤',
  keys: '🔑',
  clothing: '👕',
  accessories: '🕶️',
  bags: '🎒',
  wallets: '👛',
  jewelry: '💍',
  sports_equipment: '⚽',
  musical_instruments: '🎸',
  toys: '🧸',
  books: '📚',
  others: '📦',
};

export default function ItemCard({ item, isOwner, onToggleStatus, onDelete }) {
  const isLost = item.type === 'lost';
  const isPending = item.status === 'pending';
  const imgUrl = getImageUrl(item.image);

  return (
    <div className="item-card">
      {imgUrl ? (
        <img src={imgUrl} alt={item.title} className="item-card-image" />
      ) : (
        <div className="item-card-image-placeholder">
          {CATEGORY_ICONS[item.category] || '📦'}
        </div>
      )}

      <div className="item-card-body">
        <div className="item-card-header">
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {isLost ? '📢 Lost' : '✅ Found'}
          </span>
          <span className={`badge ${isPending ? 'badge-pending' : 'badge-recovered'}`}>
            {isPending ? '⏳ Pending' : '🎉 Recovered'}
          </span>
        </div>

        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-desc">{item.description}</p>

        <div className="item-card-meta">
          <span>📍 {item.location}</span>
          <span>📅 {new Date(item.date).toLocaleDateString()}</span>
          <span>{CATEGORY_ICONS[item.category] || '📦'} {CATEGORY_LABELS[item.category] || item.category}</span>
        </div>

        <div className="item-card-contact">
          <span>✉️ <a href={`mailto:${item.contactEmail}`}>{item.contactEmail}</a></span>
          {item.contactPhone && <span>📞 {item.contactPhone}</span>}
        </div>

        {item.reportedBy && (
          <p className="item-card-reporter">
            Reported by {item.reportedBy.name}
          </p>
        )}

        {isOwner && (
          <div className="item-card-actions">
            <button
              className={`btn btn-sm ${isPending ? 'btn-success' : 'btn-amber'}`}
              onClick={() => onToggleStatus(item._id, isPending ? 'recovered' : 'pending')}
            >
              {isPending ? '✓ Mark Recovered' : '↺ Reopen'}
            </button>
            <button className="btn btn-sm btn-danger" onClick={() => onDelete(item._id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export { CATEGORY_LABELS, CATEGORY_ICONS };
