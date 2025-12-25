import api from './axios';

export const fetchChats = async () => {
  const { data } = await api.get('/chats');
  return data;
};

export const fetchChat = async (id) => {
  const { data } = await api.get(`/chats/${id}`);
  return data;
};

export const sendMessage = async (chatId, payload) => {
  const { data } = await api.post(`/chats/${chatId}/messages`, payload);
  return data;
};
