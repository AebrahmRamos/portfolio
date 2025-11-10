import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { FiMenu, FiX, FiSun, FiMoon, FiDownload } from 'react-icons/fi';
import { useThemeContext } from '../../context/ThemeContext';
import { scrollToSection } from '../../utils/helpers';

/**
 * Navigation Header Component
 * Features:
 * - Fixed/sticky header with backdrop blur
 * - Desktop navigation links
 * - Mobile hamburger menu with drawer
 * - Dark mode toggle
 * - Resume/CV button
 * - Active section highlighting
 * - Smooth scroll to sections
 */
const Navigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { darkMode, toggleDarkMode } = useThemeContext();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Navigation items
  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Education', id: 'education' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Organizations', id: 'organizations' },
    { label: 'Contact', id: 'contact' },
  ];

  // Handle scroll for backdrop blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -80% 0px',
      threshold: 0,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = ['hero', ...navItems.map((item) => item.id)];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Handle navigation click
  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId, isMobile ? 56 : 64);
    setMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: darkMode
            ? scrolled
              ? 'rgba(30, 30, 30, 0.9)'
              : 'rgba(30, 30, 30, 0.8)'
            : scrolled
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease-in-out',
          boxShadow: darkMode && scrolled 
            ? '0 1px 0 rgba(55, 125, 255, 0.3), 0 10px 40px 10px rgba(140, 152, 164, 0.175)' 
            : scrolled ? 1 : 0,
          borderBottom: darkMode ? '1px solid rgba(55, 125, 255, 0.2)' : 'none',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 56, md: 64 },
              justifyContent: 'space-between',
            }}
          >
            {/* Logo/Name */}
            <Box
              sx={{
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
                transition: 'opacity 0.3s',
              }}
              onClick={() => handleNavClick('hero')}
            >
              <Box
                component="span"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                Aebrahm Ramos
              </Box>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    sx={{
                      color: activeSection === item.id ? 'primary.main' : 'text.primary',
                      fontWeight: activeSection === item.id ? 600 : 400,
                      minWidth: 'auto',
                      px: 2,
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                {/* Dark Mode Toggle */}
                <IconButton
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark mode"
                  sx={{
                    ml: 1,
                    minWidth: 44,
                    minHeight: 44,
                    color: 'text.primary',
                  }}
                >
                  {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </IconButton>

                {/* Resume Button */}
                <Button
                  variant="outlined"
                  startIcon={<FiDownload />}
                  href="/resume-aebrahm-ramos.pdf"
                  download
                  sx={{
                    ml: 1,
                    minHeight: 44,
                  }}
                >
                  Resume
                </Button>
              </Box>
            )}

            {/* Mobile Menu Toggle */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark mode"
                  sx={{
                    minWidth: 44,
                    minHeight: 44,
                    color: 'text.primary',
                  }}
                >
                  {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                </IconButton>
                <IconButton
                  onClick={toggleMobileMenu}
                  aria-label="Open navigation menu"
                  sx={{
                    minWidth: 44,
                    minHeight: 44,
                    color: 'text.primary',
                  }}
                >
                  <FiMenu size={24} />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: '80%',
            maxWidth: 320,
            minWidth: 280,
            backgroundColor: 'background.paper',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 3,
          }}
        >
          {/* Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <IconButton
              onClick={toggleMobileMenu}
              aria-label="Close menu"
              sx={{ minWidth: 48, minHeight: 48 }}
            >
              <FiX size={24} />
            </IconButton>
          </Box>

          {/* Navigation Items */}
          <List sx={{ flex: 1 }}>
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => handleNavClick(item.id)}
                  selected={activeSection === item.id}
                  sx={{
                    minHeight: 52,
                    borderRadius: 1,
                    px: 3,
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: activeSection === item.id ? 600 : 400,
                      fontSize: '1.0625rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          {/* Resume Button at Bottom */}
          <Button
            variant="outlined"
            startIcon={<FiDownload />}
            href="/resume-aebrahm-ramos.pdf"
            download
            fullWidth
            sx={{ minHeight: 48, mt: 2, py: 1.5, fontSize: '1rem' }}
          >
            Download Resume
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation;
