import React from 'react';
import Navigation from '../sections/Navigation';
import ScrollToTopButton from '../common/ScrollToTopButton';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navigation />
      <main id="main-content" className="layout__main">
        {children}
      </main>
      <ScrollToTopButton />
    </div>
  );
};

export default Layout;
