import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAd } from '../../api/ads.api';
import api from '../../api/axios';
import { startChat } from '../../api/chats.api';
import { useContext } from 'react';
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

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAd(id);
        setAd(data);
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

  return (
    <div>
      <h2>{ad.name}</h2>
      <p>{ad.description}</p>
      <p><strong>Price:</strong> {ad.price} ₽</p>
      <p><strong>Seller:</strong> {ad.username}</p>
      <p><strong>Location:</strong> {ad.location}</p>
      <p><strong>Contact email:</strong> {ad.contactEmail}</p>
      {ad.contactPhoneNumber && <p><strong>Phone:</strong> {ad.contactPhoneNumber}</p>}
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
        >{contactLoading ? 'Создаю чат...' : 'Написать продавцу'}</button>
      </div>
      {ad.images && ad.images.length > 0 && (
        <div>
          <h4>Images</h4>
          <div style={{ display: 'flex', gap: 8 }}>
            {ad.images.map((u, i) => {
              const src = (u || '').startsWith('http') ? u : `${api.defaults.baseURL}${u}`;
              return <img key={i} src={src} alt={`img-${i}`} style={{ width: 150, height: 100, objectFit: 'cover' }} />;
            })}
          </div>
        </div>
      )}
      {ad.categories && ad.categories.length > 0 && (
        <p><strong>Categories:</strong> {ad.categories.join(', ')}</p>
      )}
    </div>
  );
};

export default AdDetails;
