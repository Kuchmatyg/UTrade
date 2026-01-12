import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import '../styles/pages/Login.css';
import { login as loginApi } from '../api/auth.api';

const Login = () => {
  const { loginFunc } = useContext(AuthContext);
  const [Username, setUsername] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await loginApi({ Username, Password });
      if (user) {
        loginFunc(user);
        navigate('/');
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data || err.message || 'Login error');
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <h2>Авторизация</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            value={Username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Логин"
          />

          <input
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
          />

          <button type="submit">Войти</button>
        </form>

        {error && <div className="login-error">{String(error)}</div>}
      </div>
    </div>
  );
};

export default Login;
