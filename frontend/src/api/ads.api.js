import api from './axios';

export const fetchAds = async () => {
  const { data } = await api.get('/api/Advertisement');
  return data;
};

export const fetchAd = async (id) => {
  const { data } = await api.get(`/api/Advertisement/${id}`);
  return data;
};
