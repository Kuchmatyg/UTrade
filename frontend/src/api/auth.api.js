import api from './axios';

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  // expect { token }
  if (data?.token) {
    try { localStorage.setItem('token', data.token); } catch {}
    // fetch current user using saved token (interceptor will attach it)
    const { data: user } = await api.get('/auth/me');
    return user;
  }
  return null;
};

export const logout = async () => {
  try { localStorage.removeItem('token'); } catch {}
  const { data } = await api.post('/auth/logout');
  return data;
};

export const me = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
