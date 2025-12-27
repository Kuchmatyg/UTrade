import api from './axios'

export const updateProfile = async (payload) => {
    await api.put('/api/User/profile', payload);
  };

export const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/api/User/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};