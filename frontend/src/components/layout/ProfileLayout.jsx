import { Link } from 'react-router-dom';
import AdCard from "../Ads/AdCard";
import Avatar from '../avatar/Avatar';

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
      <div>
      <h2>Профиль</h2>

      {/* АВАТАР */}
      <div style={{ marginBottom: 12 }}>
        {isMyProfile &&(
        <Avatar user={user} size={80} onChange={handleFileChange}/>)}

        {!isMyProfile &&(
        <Avatar user={user} size={80} />)}
        
      </div>

      <p><b>Username:</b> {user.username}</p>
      <p><b>ФИО:</b> {user.firstName} {user.middleName} {user.surname}</p>
      <p><b>Рейтинг:</b> ⭐ {user.rating} ({user.reviewsCount} отзывов)</p>

      {/* ПРОСМОТР */}
      {isMyProfile && !edit && (
        <>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Телефон:</b> {user.phone || '-'}</p>
          <p><b>Местоположение:</b> {user.location || '-'}</p>
          <button onClick={onEditClick}>Редактировать профиль</button>
        </>
      )}

      {/* РЕДАКТИРОВАНИЕ */}
      {isMyProfile && edit && (
        <>
          <input
            value={form.email}
            onChange={e => onFormChange('email', e.target.value)}
          />
          <input
            value={form.phone}
            onChange={e => onFormChange('phone', e.target.value)}
          />
          <input
            value={form.location}
            onChange={e => onFormChange('location', e.target.value)}
          />

          <button onClick={onSaveProfile}>Сохранить</button>
          <button onClick={onCancelEdit}>Отмена</button>
        </>
      )}
      <p></p>
      {/* ФИЛЬТР СТАТУСОВ */}
      <div style={{ marginBottom: 12 }}>
        {STATUSES.map(s => (
          <button
            key={s.label}
            onClick={() => onStatusChange(s.value)}
            style={{ fontWeight: status === s.value ? 'bold' : 'normal' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {ads.length === 0 && <div>Объявлений нет</div>}
      {ads.map(ad => (
        <AdCard key={ad.id} ad={ad} />
      ))}

      <h3>Отзывы</h3>

      {reviews.length === 0 && <div>Отзывов пока нет</div>}
      {reviews.map(r => (
        <div key={r.id}>
          <Link to={`/users/${r.authorId}`}>
            <strong>{r.authorName}</strong>
          </Link>
          <div>⭐ {r.rating}</div>
          {r.comment && <p>{r.comment}</p>}
        </div>
      ))}


    </div>
  );
};

export default ProfileLayout;
