import React, { useState, useRef, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout as logoutApi } from '../../api/auth.api';
import { AuthContext } from '../../auth/AuthContext';
import '../../styles/components/Header.css'
// import '../../assets/logo.jpg';

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  const { logoutFunc, user } = useContext(AuthContext);

  const handleLogout = async () => {
    const ok = window.confirm('Are you sure you want to logout?');
    if (!ok) return;
    try { await logoutApi(); } catch {};
    try { localStorage.removeItem('token'); } catch {}
    try { logoutFunc(); } catch {}
    navigate('/login');
  };

  return (
    <header className="layout-header">
      <nav className="nav-container">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            <img src='/src/assets/logo2.png' alt="Home" height={36} />
          </Link>
        </div>

          <div className="nav-right">
          <Link to="/chats">Чаты</Link>
          <Link to="/notifications">Уведомления</Link>
          {user && (user.role === 'Moderator' || user.role === 'Admin') && (
            <Link to="/moderator/ads">Moderator</Link>
          )}

          <div className="profile-dropdown" ref={ref}>
            <button className="profile-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
              <svg className="user-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 12c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 21c0-3.866 3.582-7 9-7s9 3.134 9 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={`chev ${open ? 'open' : ''}`}>▾</span>
            </button>
            {open && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setOpen(false)}>Профиль</Link>
                <Link to="/myads/create" onClick={() => setOpen(false)}>Разместить объявление</Link>
                <button onClick={handleLogout}>Выйти</button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
