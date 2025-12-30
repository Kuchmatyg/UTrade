import api from './axios';

export const fetchAds = async () => {
  const { data } = await api.get('/api/Advertisement');
  return data;
};

export const fetchAd = async (id) => {
  const { data } = await api.get(`/api/Advertisement/${id}`);
  return data;
};

export const createAd = async (payload) => {
  const { data } = await api.post('/api/Advertisement', payload);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/api/advertisement/categories');
  return data;
};

export const uploadAdImage = async (adId, file) => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post(`/api/Advertisement/${adId}/images`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteAd = async (adId) => {
  const { data } = await api.delete(`/api/Advertisement/${adId}`);
  return data;
};

export const updateAd = async (adId, payload) => {
  const { data } = await api.put(`/api/Advertisement/${adId}`, payload);
  return data;
};

export const resubmitAd = async (adId) => {
  const { data } = await api.post(`/api/Advertisement/${adId}/resubmit`);
  return data;
};

export const completeAd = async (adId) => {
  const { data } = await api.post(`/api/Advertisement/${adId}/complete`);
  return data;
};

export const fetchPendingAds = async () => {
  const { data } = await api.get('/api/Advertisement/pending');
  return data;
};

export const approveAd = async (adId) => {
  const { data } = await api.post(`/api/Advertisement/${adId}/approve`);
  return data;
};

export const rejectAd = async (adId, reason) => {
  const { data } = await api.post(`/api/Advertisement/${adId}/reject`, { Reason: reason });
  return data;
};

export const fetchMyAdvertisements = async (status) => {
  const params = status ? { status } : {};
  const { data } = await api.get('/api/Advertisement/my', { params });
  return data;
};
