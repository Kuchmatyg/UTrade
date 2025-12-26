import api from './axios';

export const fetchChats = async () => {
  const { data } = await api.get('/api/Chat');
  return data;
};

export const fetchChatMessages = async (chatId) => {
  const { data } = await api.get(`/api/Chat/${chatId}/messages`);
  return data;
};

export const startChat = async (advertisementId) => {
  const { data } = await api.post(`/api/Chat/${advertisementId}/start`);
  return data;
};

// Backend expects raw string in body for message content
export const sendMessage = async (chatId, content) => {
  // Send as JSON object { content } to match backend DTO
  const { data } = await api.post(`/api/Chat/${chatId}/message`, { content });
  return data;
};
