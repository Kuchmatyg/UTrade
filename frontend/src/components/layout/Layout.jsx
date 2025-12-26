import React from 'react';
import Header from './Header';

const Layout = ({ children }) => (
  <div className="layout-root">
    <Header />
    <main className="layout-main">{children}</main>
  </div>
);

export default Layout;
