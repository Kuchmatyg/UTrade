import { Link } from 'react-router-dom';
import AdCard from "../Ads/AdCard";
import Avatar from '../avatar/Avatar';
import '../../styles/components/ProfileLayout.css'

const ProfileLayout = ({
  user,
  status,
  STATUSES,

  isMyProfile,
  edit,
  form,

  onStatusChange,
  onEditClick,
  onCancelEdit,
  onFormChange,
  onSaveProfile,
  onAvatarChange,

  ads,
  reviews,
}) => {
   const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    onAvatarChange(e.target.files[0]);
  };
  return (
    <div className="profile-page">

      {/* ===== HEADER ===== */}
      <div className="profile-header">
        <Avatar
          user={user}
          size={90}
          onChange={isMyProfile ? handleFileChange : undefined}
        />

        <div className="profile-info">
          <h2>{user.firstName} {user.middleName} {user.surname}</h2>
          <p>{user.username}</p>
          <p>⭐ {user.rating} ({user.reviewsCount} отзывов)</p>
        </div>
      </div>

      {/* ===== VIEW MODE ===== */}
      {isMyProfile && !edit && (
        <div className="profile-contacts">
          <p><b>Email:</b> {user.email}</p>
          <p><b>Телефон:</b> {user.phone || '-'}</p>
          <p><b>Местоположение:</b> {user.location || '-'}</p>

          <button className="primary-btn" onClick={onEditClick}>
            Редактировать профиль
          </button>
        </div>
      )}

      {/* ===== EDIT MODE ===== */}
      {isMyProfile && edit && (
        <div className="profile-edit">
          <input
            value={form.email}
            onChange={e => onFormChange('email', e.target.value)}
            placeholder="Email"
          />
          <input
            value={form.phone}
            onChange={e => onFormChange('phone', e.target.value)}
            placeholder="Телефон"
          />
          <input
            value={form.location}
            onChange={e => onFormChange('location', e.target.value)}
            placeholder="Город"
          />

          <div className="edit-actions">
            <button className="primary-btn" onClick={onSaveProfile}>
              Сохранить
            </button>
            <button className="secondary-btn" onClick={onCancelEdit}>
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* ===== STATUS FILTER ===== */}
      <div className="status-tabs">
        {STATUSES.map(s => (
          <button
            key={s.label}
            className={status === s.value ? 'active' : ''}
            onClick={() => onStatusChange(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ===== ADS ===== */}
      {ads.length === 0 && <div>Объявлений нет</div>}

      <div className="profile-ads-grid">
        {ads.map(ad => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>

      {/* ===== REVIEWS ===== */}
      <h3>Отзывы</h3>

      {reviews.length === 0 && <div>Отзывов пока нет</div>}

      <div className="reviews-list">
        {reviews.map(r => (
          <div key={r.id} className="review-card">
            <Link to={`/users/${r.authorId}`}>
              <strong>{r.authorName}</strong>
            </Link>
            <div>⭐ {r.rating}</div>
            {r.comment && <p>{r.comment}</p>}
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProfileLayout;
