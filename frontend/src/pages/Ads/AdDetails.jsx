import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAd, approveAd, rejectAd, completeAd, deleteAd } from '../../api/ads.api';
import api from '../../api/axios';
import { startChat } from '../../api/chats.api';
import { useContext } from 'react';
import { fetchReviewsByAd, fetchHasReviewed, postReview } from '../../api/reviews.api';
import { AuthContext } from '../../auth/AuthContext';
import '../../styles/pages/AdDetails.css';
import { Link } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showOwnerMenu, setShowOwnerMenu] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const openApprove = (adId) => setModal({ open: true, adId, action: 'approve', reason: '' });
  const openReject = (adId) => setModal({ open: true, adId, action: 'reject', reason: '' });
  const [modal, setModal] = useState({ open: false, adId: null, action: null, reason: '' });
  const close = () => setModal({ open: false, adId: null, action: null, reason: '' });
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAd(id);
        setAd(data);

        const reviewsRes = await fetchReviewsByAd(data.id);
        setReviews(reviewsRes);

        const hasReviewedRes = await fetchHasReviewed(data.id);
        setAlreadyReviewed(hasReviewedRes);

      } catch (err) {
        console.error('fetchAd error', err);
        setError(err?.message || 'Failed to load ad');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);




  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!ad) return <div>No data</div>;


  const submit = async () => {
      if (!modal.adId) return;
      try {
        if (modal.action === 'approve') {
          await approveAd(modal.adId);
          navigate('/moderator/ads'); 
        } else if (modal.action === 'reject') {
          await rejectAd(modal.adId, modal.reason || 'No reason');
          navigate('/moderator/ads'); 
        }
        close();

      } catch (e) {
        console.error(e);
        alert('Action failed');
      }
    };

    const handleCompleteBtn = async () => {
    try {
      await completeAd(ad.id)
      navigate('/profile');
    } catch {
      alert('Не удалось завершить объявление');
    }
  };

  const handleDeleteBtn = async () => {
    if (!window.confirm('Удалить объявление?')) return;

    try {
      await deleteAd(ad.id)
      navigate('/profile');
    } catch {
      alert('Не удалось удалить объявление');
    }
  };

return (
  <div className="ad-details">
    {/* Заголовок с названием и меню владельца */}
  <div className="ad-header">
    <h2>{ad.name}</h2>
    {user && user.id === ad.ownerId && (
      <div className="owner-menu-wrapper">
        <button className="dots-btn" onClick={() => setShowOwnerMenu(v => !v)}>⋮</button>

        {showOwnerMenu && (
          <div className="owner-menu">
            <button onClick={handleCompleteBtn}>✅ Завершить</button>
            <button onClick={() => navigate(`/myads/edit/${ad.id}`)}>✏️ Изменить</button>
            <button className="danger" onClick={handleDeleteBtn}>🗑 Удалить</button>
          </div>
        )}
      </div>
    )}
  </div>

  {/* Основной блок: фото слева, информация справа */}
  <div className="ad-main">
    {/* Левая колонка — фотографии */}
    {ad.images?.length > 0 && (
      <div className="ad-photos">
        {ad.images.map((u, i) => {
          const src = u.startsWith('http') ? u : `${api.defaults.baseURL}${u}`;
          return (
            <img
              key={i}
              src={src}
              alt={`img-${i}`}
              onClick={() => { setPhotoIndex(i); setLightboxOpen(true); }}
            />
          );
        })}
      </div>
    )}

    {/* Правая колонка — информация */}
    <div className="ad-info">
      {ad.rejectionReason && (
        <p className="rejection-reason">
          <strong>Причина отклонения:</strong> {ad.rejectionReason}
        </p>
      )}
      <p><strong>Цена:</strong> {ad.price} ₽</p>
      <p><strong>Описание:</strong> {ad.description}</p>
      <p>
        <strong>Продавец:</strong> <Link to={`/users/${ad.ownerId}`}>{ad.username}</Link>
        {ad.sellerRating && <span> ⭐ {ad.sellerRating.toFixed(1)} ({ad.sellerReviewsCount})</span>}
      </p>
      <p><strong>Местоположение:</strong> {ad.location}</p>
      <p><strong>Email:</strong> {ad.contactEmail}</p>
      {ad.contactPhoneNumber && <p><strong>Телефон:</strong> {ad.contactPhoneNumber}</p>}
      {ad.categories?.length > 0 && <p><strong>Категории:</strong> {ad.categories.join(', ')}</p>}

      {/* Кнопка написать продавцу */}
      {user && user.id !== ad.ownerId && (
        <button
          disabled={contactLoading}
          onClick={async () => {
            try {
              setContactLoading(true);
              const chat = await startChat(ad.id);
              navigate(`/chats/${chat.id}`);
            } finally { setContactLoading(false); }
          }}
        >
          {contactLoading ? 'Создаю чат...' : 'Написать продавцу'}
        </button>
      )}

      {!user && <button onClick={() => navigate('/login')}>Войти, чтобы написать продавцу</button>}

    </div>
  </div>

  {/* Lightbox для фотографий */}
  {lightboxOpen && (
    <Lightbox
      open={lightboxOpen}
      index={photoIndex}
      close={() => setLightboxOpen(false)}
      slides={ad.images.map(u => ({ src: u.startsWith('http') ? u : `${api.defaults.baseURL}${u}` }))}
    />
  )}

    {user?.role === 'Moderator' && (
      <div>
        <button onClick={() => setShowMenu(v => !v)}>⋮</button>

        {showMenu && (
          <div>
            <button onClick={() => openApprove(ad.id)}>✅ Одобрить</button>
            <button onClick={() => openReject(ad.id)}>❌ Забраковать</button>
          </div>
        )}
      </div>
    )}
    {modal.open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{modal.action === 'approve' ? 'Одобрить объявление' : 'Забраковать объявление'}</h3>
            {modal.action === 'reject' && (
              <textarea placeholder="Причина отмены объявления" value={modal.reason} onChange={(e) => setModal(m => ({ ...m, reason: e.target.value }))} />
            )}
            <div className="modal-actions">
              <button onClick={submit}>Подтвердить</button>
              <button onClick={close}>Cancel</button>
            </div>
          </div>
        </div>
    )}

    {user && user.id !== ad.ownerId && !alreadyReviewed && (
    <div style={{ marginTop: 20 }}>
      <h3>Оставить отзыв</h3>

      <label>Оценка:</label>
      <select value={rating} onChange={e => setRating(+e.target.value)}>
        {[1,2,3,4,5].map(v => (
          <option key={v} value={v}>{v}</option>
        ))}
      </select>

      <br />

      <textarea
        placeholder="Комментарий (необязательно)"
        value={comment}
        onChange={e => setComment(e.target.value)}
        style={{ width: '100%', marginTop: 8 }}
      />

      <button
        disabled={reviewLoading}
        onClick={async () => {
          try {
            setReviewLoading(true);
            console.log('Submitting review', { targetUserId: ad.ownerId}, { User: user.id });
            await postReview({
                  targetUserId: ad.ownerId,
                  rating,
                  comment
                }, ad.id);

            alert('Отзыв отправлен');

            // перезагружаем отзывы
            const res = await fetchReviewsByAd(ad.id);
            setReviews(res);
          } catch (e) {
            alert(e.response?.data?.message || 'Ошибка при отправке отзыва');
          } finally {
            setReviewLoading(false);
          }
        }}
      >
        Отправить
      </button>
  </div> 
    )}
    {alreadyReviewed && (
      <p style={{ marginTop: 20, color: '#777' }}>
        Вы уже оставили отзыв по этому объявлению
      </p>
    )}
    {reviews.length > 0 && (
      <div style={{ marginTop: 24 }}>
        <h3>Отзывы</h3>

        {reviews.map(r => (
          <div key={r.id} style={{ borderBottom: '1px solid #ddd', padding: 8 }}>
            <strong>{r.authorName}</strong>
            <div>Оценка: ⭐ {r.rating}</div>
            {r.comment && <p>{r.comment}</p>}
            <small>{new Date(r.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    )}


  </div>
);
};
export default AdDetails;
