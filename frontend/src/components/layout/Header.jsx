import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header>
    <nav>
      <Link to="/">Home</Link> | <Link to="/profile">Profile</Link> | <Link to="/notifications">Notifications</Link>
    </nav>
  </header>
);

export default Header;
