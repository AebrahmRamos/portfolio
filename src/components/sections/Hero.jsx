import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { FiMail, FiBriefcase } from 'react-icons/fi';
import { scrollToSection } from '../../utils/helpers';
import localProfile from '../../assets/profile.jpg';

// Use remote profile image hosted on Vercel Blob; fallback to local asset on error
const remoteProfile = 'https://wcnushafgkumpgjy.public.blob.vercel-storage.com/IMG_9191-2.jpg';

const Hero = () => {
  return (
    <Box
      id="hero"
      component="section"
      sx={{
        minHeight: { xs: 'auto', md: 'calc(100vh - 64px)' },
        display: 'flex',
        alignItems: 'center',
        py: { xs: 10, sm: 12, md: 12 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          alignItems="center"
          direction={{ xs: 'column-reverse', md: 'row' }}
        >
          {/* Text Content - Left Side */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box>
              {/* Greeting */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                }}
              >
                Hi, I'm
              </Typography>

              {/* Name with underline effect */}
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  Aebrahm Ramos
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '8px',
                    left: 0,
                    width: '100%',
                    height: '12px',
                    backgroundColor: 'secondary.main',
                    opacity: 0.3,
                    zIndex: 0,
                  }}
                />
              </Box>

              {/* Description */}
              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: 2,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                }}
              >
                Computer Systems Engineering student at De La Salle University Manila, graduating August 2027.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  fontWeight: 500,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                }}
              >
                Specializing in full-stack development, system design, and AI-powered solutions.
              </Typography>

              {/* CTA Buttons */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FiMail />}
                  onClick={() => scrollToSection('contact')}
                  sx={{
                    minHeight: 48,
                    px: 4,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  Get in touch
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<FiBriefcase />}
                  onClick={() => scrollToSection('projects')}
                  sx={{
                    minHeight: 48,
                    px: 4,
                    width: { xs: '100%', sm: 'auto' },
                  }}
                >
                  View my work
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Profile Image - Right Side */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={remoteProfile}
                onError={(e) => {
                  // fallback to local asset if remote blob is unavailable
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = localProfile;
                }}
                alt="Aebrahm Ramos - Profile"
                loading="lazy"
                sx={{
                  width: { xs: 240, sm: 300, md: 380, lg: 400 },
                  height: { xs: 240, sm: 300, md: 380, lg: 400 },
                  borderRadius: '50%',
                  border: '4px solid',
                  borderColor: 'primary.main',
                  objectFit: 'cover',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 0 30px rgba(55, 125, 255, 0.4), 0 10px 40px 10px rgba(140, 152, 164, 0.175)'
                      : '0 10px 40px 10px rgba(140, 152, 164, 0.175)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 0 40px rgba(55, 125, 255, 0.6), 0 10px 40px 10px rgba(140, 152, 164, 0.175)'
                        : '0 10px 40px 10px rgba(140, 152, 164, 0.175)',
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
