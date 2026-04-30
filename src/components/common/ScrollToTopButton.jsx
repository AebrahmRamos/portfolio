import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import { Fab } from '../m3';
import './ScrollToTopButton.css';

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', toggle, { passive: true });
    return () => window.removeEventListener('scroll', toggle);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <Fab
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      variant="primary"
      className={`scroll-to-top ${visible ? 'scroll-to-top--visible' : ''}`}
    >
      <FiArrowUp size={24} />
    </Fab>
  );
};

export default ScrollToTopButton;
