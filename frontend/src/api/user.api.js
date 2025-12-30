import api from './axios'

export const updateProfile = async (payload) => {
    await api.put('/api/users/profile', payload);
  };

export const fetchUserProfile = async (userId) => {
  const { data } = await api.get(`/api/users/${userId}`);
  return data;
};

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/api/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};