import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../auth/AuthContext';
import ProfileLayout from '../components/layout/ProfileLayout';
import { updateProfile, uploadAvatar } from '../api/user.api';
import { fetchMyAdvertisements } from '../api/ads.api';
import { fetchReviewsByUser } from '../api/reviews.api';

const STATUSES = [
  { value: null, label: 'Все' },
  { value: 'Pending', label: 'На модерации' },
  { value: 'Approved', label: 'Опубликованные' },
  { value: 'Rejected', label: 'Отклонённые' },
  { value: 'Completed', label: 'Завершённые' },
];

const MyProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [status, setStatus] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
  });
  useEffect(() => {
    if (!user) return;

    fetchMyAdvertisements(status).then(setAds);
  }, [status, user]);

  // отзывы + форма
  useEffect(() => {
    if (!user) return;

    fetchReviewsByUser(user.id).then(setReviews);

    setForm({
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
    });
  }, [user]);
  
  const onStatusChange = (newStatus) => {
    setStatus(newStatus);
  };

  const onEditClick = () => setEdit(true);
  const onCancelEdit = () => setEdit(false);

  const onFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const onSaveProfile = async () => {
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
  const onAvatarChange = async (file) => {
  try {
    const data = await uploadAvatar(file); // POST /api/user/profile/avatar
    updateUser({ ...user, avatarUrl: data.avatarUrl });
  } catch (e) {
    console.error(e);
    alert('Ошибка загрузки аватара');
  }
};
  return (
    <ProfileLayout
      user={user}
      status={status}
      STATUSES={STATUSES}

      isMyProfile={true}
      edit={edit}
      form={form}

      onStatusChange={onStatusChange}
      onEditClick={onEditClick}
      onCancelEdit={onCancelEdit}
      onFormChange={onFormChange}
      onSaveProfile={onSaveProfile}
      onAvatarChange={onAvatarChange}

      ads={ads}
      reviews={reviews}
    />
  );
};


export default MyProfilePage;
