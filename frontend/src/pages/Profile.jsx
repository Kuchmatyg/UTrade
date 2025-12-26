import React, { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import '../styles/pages/Profile.css';
import { logout as logoutApi } from '../api/auth.api';

const Profile = () => {
  const { user, logoutFunc } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // ignore
    }
    try { localStorage.removeItem('token'); } catch {}
    logoutFunc();
  };

  if (!user) return <div>No user</div>;

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p>{user.firstName} {user.middleName} {user.surname}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
