import api from './axios';

// Get reviews for a user (owner) by user id
export const fetchUserReviews = async (userId) => {
  const { data } = await api.get(`/api/users/${userId}/reviews`);
  return data;
};

// Create review: body must match CreateReviewDto
export const postReview = async (adId, payload) => {
  const body = { ...payload, AdvertisementId: adId };
  const { data } = await api.post('/api/reviews', body);
  return data;
};
