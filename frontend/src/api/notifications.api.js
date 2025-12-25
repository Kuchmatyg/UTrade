import api from './axios';

export const fetchNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await api.post(`/notifications/${id}/read`);
  return data;
};
