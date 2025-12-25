import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { login as loginApi } from '../api/auth.api';

const Login = () => {
  const { loginFunc } = useContext(AuthContext); //походу лишний
  const [Username, setLogin] = useState('');
  const [Password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`login - ${Username}\n password - ${Password}` )
      const user = await loginApi({ Username, Password });
      loginFunc(user);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input value={Username} onChange={(e) => setLogin(e.target.value)} placeholder="Username" />
        <input type="password" value={Password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
