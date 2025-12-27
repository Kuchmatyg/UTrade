import api from './axios'

export const updateProfile = async (payload) => {
    await api.put('/api/User/profile', payload);
  };