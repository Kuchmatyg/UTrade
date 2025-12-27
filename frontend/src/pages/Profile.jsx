import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { fetchMyAdvertisements } from '../api/ads.api';
import { updateProfile } from '../api/user.api';
import AdCard from "../components/Ads/AdCard";

const STATUSES = [
  { value: null, label: 'Все' },
  { value: 'Pending', label: 'На модерации' },
  { value: 'Approved', label: 'Опубликованные' },
  { value: 'Rejected', label: 'Отклонённые' },
  { value: 'Completed', label: 'Завершённые' },
];


const Profile = () => {
  const { user, updateUser, loading: authLoading } = useContext(AuthContext);
  const [status, setStatus] = useState(null);
  const [ads, setAds] = useState([]);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    email: '',
    phone: '',
    location: '',
  });
  const [adsLoading, setAdsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadAds = async () => {
      setAdsLoading(true);
      try {
        const data = await fetchMyAdvertisements(status);
        setAds(data);
      } finally {
        setAdsLoading(false);
      }
    };

    loadAds();
  }, [status, user]);

  useEffect(() => {
    if (!user) return;
  
    setForm({
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
    });
  }, [user]);

  const handleSave = async () => {
    try {
      console.log(form.email);
      console.log(form.phone);
      console.log(form.location);
      await updateProfile(form);
      updateUser({ ...user, ...form });
      setEdit(false);
    } catch (e) {
      alert('Failed to update profile');
      console.error(e);
    }
  };

  if (authLoading) return <div>Loading profile...</div>;
  if (!user) return <div>No user</div>;

  return (
    <div>
      <h2>Profile</h2>

      <p><strong>Username:</strong> {user.username}</p>
      {/* <p><strong>Email:</strong> {user.email}</p> */}
      <p><strong>Role:</strong> {user.role}</p>

      {!edit ? (
        <>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || '-'}</p>
          <p><strong>Location:</strong> {user.location || '-'}</p>

          <button onClick={() => setEdit(true)}>Edit profile</button>
        </>
      ) : (
        <>
          <input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
          />

          <input
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone number"
          />

          <input
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            placeholder="Location"
          />

          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEdit(false)}>Cancel</button>
        </>
      )}

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

      {adsLoading && <div>Loading...</div>}

      {!adsLoading && ads.length === 0 && (
        <div>Объявлений нет</div>
      )}

      {ads.map( (ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
};

export default Profile;
