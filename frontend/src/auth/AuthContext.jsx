import React, { createContext, useState, useEffect } from 'react';
import { me as meApi } from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          if (mounted) setUser(null);
          return;
        }
        const data = await meApi();
        if (mounted) setUser(data ?? null);
      } catch (e) {
        console.error('AuthContext: me() failed', e);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const loginFunc = (u) => setUser(u);
  const logoutFunc = () => setUser(null);
  const updateUser = (u) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, loginFunc, logoutFunc, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
