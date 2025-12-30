import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfileLayout from '../components/layout/ProfileLayout';
import { fetchReviewsByUser } from '../api/reviews.api';
import { fetchUserProfile } from '../api/user.api';
import { fetchAdsByUser } from '../api/ads.api';
import api from '../api/axios';

const STATUSES = [
  { value: 'Approved', label: 'Опубликованные' },
  { value: 'Completed', label: 'Завершённые' },
];

const UserProfilePage = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // профиль пользователя
  useEffect(() => {
    fetchUserProfile(id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [id]);

  // объявления
  useEffect(() => {
    if (!id) return;
    fetchAdsByUser(id, status).then(setAds);
  }, [status, user]);

  const onStatusChange = (newStatus) => {
    setStatus(newStatus);
  };
  
  // отзывы
  useEffect(() => {
    if (!id) return;
    fetchReviewsByUser(id).then(setReviews);
  }, [id]);

  if (loading) return <div>Загрузка профиля...</div>;
  if (!user) return <div>Пользователь не найден</div>;

  return (
    <ProfileLayout
      user={user}
      ads={ads}
      reviews={reviews}
      status={status}
      STATUSES={STATUSES}
      onStatusChange={onStatusChange}

      isMyProfile={false}   // 🔴 ВАЖНО
    />
  );
};

export default UserProfilePage;
