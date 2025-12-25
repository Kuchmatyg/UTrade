import api from './axios';

export const fetchReviews = async (adId) => {
  const { data } = await api.get(`/advertisements/${adId}/reviews`);
  return data;
};

export const postReview = async (adId, payload) => {
  const { data } = await api.post(`/advertisements/${adId}/reviews`, payload);
  return data;
};
