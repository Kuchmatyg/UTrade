import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { fetchMyAdvertisements } from '../api/ads.api';


const STATUSES = [
  { value: null, label: 'Все' },
  { value: 'Pending', label: 'На модерации' },
  { value: 'Approved', label: 'Опубликованные' },
  { value: 'Rejected', label: 'Отклонённые' },
  { value: 'Completed', label: 'Завершённые' },
];


const Profile = () => {
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadAds = async () => {
      setLoading(true);
      try {
        const data = await fetchMyAdvertisements(status);
        setAds(data);
      } finally {
        setLoading(false);
      }
    };

    loadAds();
  }, [status, user]);

  if (!user) return <div>No user</div>;

  return (
    <div>
      <h2>Profile</h2>

      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <hr />

      <h3>Мои объявления</h3>

      <div style={{ marginBottom: 12 }}>
        {STATUSES.map(s => (
          <button
            key={s.label}
            onClick={() => setStatus(s.value)}
            style={{
              marginRight: 6,
              fontWeight: status === s.value ? 'bold' : 'normal'
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading && <div>Loading...</div>}

      {!loading && ads.length === 0 && (
        <div>Объявлений нет</div>
      )}

      {ads.map(ad => (
        <div key={ad.id} style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <div><strong>{ad.name}</strong></div>
          <div>Цена: {ad.price}</div>
          <div>Статус: {ad.status}</div>
          <div>Создано: {new Date(ad.createdAt).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
