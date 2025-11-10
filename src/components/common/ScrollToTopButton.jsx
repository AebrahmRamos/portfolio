import React, { useState, useEffect } from 'react';
import { Fab, Zoom } from '@mui/material';
import { FiArrowUp } from 'react-icons/fi';

/**
 * Scroll to Top Button Component
 * Features:
 * - Shows when user scrolls down
 * - Smooth scroll to top on click
 * - Fixed position in bottom-right corner
 * - Accessible with ARIA labels
 */
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        sx={{
          position: 'fixed',
          bottom: { xs: 80, sm: 90 }, // Increased to avoid reCAPTCHA badge
          right: { xs: 20, sm: 32 },
          zIndex: 1000,
          width: { xs: 48, sm: 56 },
          height: { xs: 48, sm: 56 },
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease-in-out',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 0 20px rgba(55, 125, 255, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)'
              : '0 8px 16px rgba(0, 0, 0, 0.15)',
        }}
      >
        <FiArrowUp size={24} />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton;
