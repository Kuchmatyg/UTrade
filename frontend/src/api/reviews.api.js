import api from './axios';

// отзывы по объявлению
export const fetchReviewsByAd = async (adId) => {
  const { data } = await api.get(`/api/reviews/by-ad/${adId}`);
  return data;
};

// создать отзыв
export const postReview = async (payload, adId) => {
  const body = {
    AdvertisementId: adId,
    TargetUserId: payload.targetUserId,
    Rating: payload.rating,
    Comment: payload.comment
  };

  const { data } = await api.post('/api/reviews', body);
  return data;
};
// отзывы по пользователю
export const fetchReviewsByUser = async (userId) => {
  const { data } = await api.get(`/api/reviews/by-user/${userId}`);
  return data;
};


export const fetchHasReviewed = async (adId) => {
  const { data } = await api.get(`/api/reviews/by-ad/${adId}/mine`);
  return data; // true / false
};
