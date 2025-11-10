import React from 'react';
import { Box, Container, Typography, Divider, Button } from '@mui/material';
import { scrollToSection } from '../../utils/helpers';

const Footer = () => {
  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.default',
        pt: { xs: 8, sm: 6 },
        pb: { xs: 6, sm: 4 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
        {/* Top Section - Logo and Navigation */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Logo/Name */}
          <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, width: { xs: '100%', sm: 'auto' } }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                mb: 0.5,
                textDecoration: 'underline',
              }}
            >
              Aebrahm
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.25rem',
                textDecoration: 'underline',
              }}
            >
              Ramos
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              justifyContent: { xs: 'center', sm: 'flex-end' },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                sx={{
                  color: 'text.primary',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  minWidth: 'auto',
                  px: 1,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: 'primary.main',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Bottom Section - Copyright and Description */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              mb: 1,
            }}
          >
            © 2025 Aebrahm Ramos. All rights reserved
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.6,
            }}
          >
            Computer Systems Engineering Student at De La Salle University Manila. Specializing in
            MERN stack development and organizational management systems.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
