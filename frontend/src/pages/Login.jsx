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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={Username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {error && <div style={{ color: 'red' }}>{String(error)}</div>}
    </div>
  );
};

export default Login;
