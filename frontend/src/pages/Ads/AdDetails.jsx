import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAd, approveAd, rejectAd } from '../../api/ads.api';
import api from '../../api/axios';
import { startChat } from '../../api/chats.api';
import { useContext } from 'react';
import { fetchReviewsByAd, fetchHasReviewed, postReview } from '../../api/reviews.api';

import { AuthContext } from '../../auth/AuthContext';
import '../../styles/pages/AdDetails.css';

const AdDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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
//        await useEffect();
        close();

      } catch (e) {
        console.error(e);
        alert('Action failed');
      }
    };


return (
  <div>
    
    <h2>{ad.name}</h2>
      <h2>
        Продавец: {ad.username}
        {ad.sellerRating && (
          <span>
            ⭐ {ad.sellerRating.toFixed(1)} ({ad.sellerReviewsCount})
          </span>
        )}
      </h2>

    <p>{ad.description}</p>
    <p><strong>Price:</strong> {ad.price} ₽</p>
    <p><strong>Location:</strong> {ad.location}</p>
    <p><strong>Contact email:</strong> {ad.contactEmail}</p>
    {ad.contactPhoneNumber && (
      <p><strong>Phone:</strong> {ad.contactPhoneNumber}</p>
    )}
    <div style={{ margin: '8px 0' }}>
      <button
        disabled={contactLoading}
        onClick={async () => {
          if (!user) return navigate('/login');
          try {
            setContactLoading(true);
            const chat = await startChat(ad.id);
            navigate(`/chats/${chat.id}`);
          } catch (err) {
            console.error('startChat error', err);
            alert('Не удалось создать чат');
          } finally {
            setContactLoading(false);
          }
        }}
      >
        {contactLoading ? 'Создаю чат...' : 'Написать продавцу'}
      </button>
    </div>

    {ad.categories && ad.categories.length > 0 && (
      <p><strong>Categories:</strong> {ad.categories.join(', ')}</p>
    )}
    {ad.images && ad.images.length > 0 && (
      <div>
        <h4>Images</h4>
        <div style={{ display: 'flex', gap: 8 }}>
          {ad.images.map((u, i) => {
            const src = (u || '').startsWith('http')
              ? u
              : `${api.defaults.baseURL}${u}`;
            return (
              <img
                key={i}
                src={src}
                alt={`img-${i}`}
                style={{ width: 150, height: 100, objectFit: 'cover' }}
              />
            );
          })}
        </div>
      </div>
    )}

    {user?.role === 'Moderator' && (
      <div>
        <button onClick={() => setShowMenu(v => !v)}>⋮</button>

        {showMenu && (
          <div>
            <button onClick={() => openApprove(ad.id)}>✅ Accept</button>
            <button onClick={() => openReject(ad.id)}>❌ Reject</button>
          </div>
        )}
      </div>
    )}
    {modal.open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>{modal.action === 'approve' ? 'Approve advertisement' : 'Reject advertisement'}</h3>
            {modal.action === 'reject' && (
              <textarea placeholder="Reason for rejection" value={modal.reason} onChange={(e) => setModal(m => ({ ...m, reason: e.target.value }))} />
            )}
            <div className="modal-actions">
              <button onClick={submit}>{modal.action === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}</button>
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
            <strong>{r.authorUsername}</strong>
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
