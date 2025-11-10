import React from 'react';
import { Box } from '@mui/material';
import Navigation from '../sections/Navigation';
import ScrollToTopButton from '../common/ScrollToTopButton';

/**
 * Layout Component
 * Wraps the entire application with:
 * - Fixed navigation header
 * - Main content area with proper spacing
 * - Smooth scroll behavior
 * - Back to top button
 */
const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        transition: 'background-color 0.3s ease-in-out',
      }}
    >
      {/* Navigation Header */}
      <Navigation />

      {/* Main Content with spacing for fixed header */}
      <Box
        component="main"
        id="main-content"
        sx={{
          paddingTop: { xs: '56px', md: '64px' }, // Header height offset
        }}
      >
        {children}
      </Box>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </Box>
  );
};

export default Layout;
