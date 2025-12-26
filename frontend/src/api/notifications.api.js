import api from './axios';

export const fetchNotifications = async () => {
  const { data } = await api.get('/api/notifications');
  return data;
};

export const markAsRead = async (ntId) => {
  const { data } = await api.post(`/api/notifications/${ntId}/read`);
  return data;
};

export const deleteNotification = async (ntId) => {
  const { data } = await api.delete(`/api/notifications/${ntId}/delete`);
  return data;
};
