import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';

const About = () => {
  const quickFacts = [
    {
      label: 'University:',
      value: 'DLSU Manila',
    },
    {
      label: 'Program and Major:',
      value: 'Computer Science major in Computer Systems Engineering',
    },
    {
      label: 'Expected Graduation:',
      value: 'August 2027',
    },
    {
      label: 'Achievement:',
      value: 'Globe Innovania 2025 - Top 2',
    },
    {
      label: 'Current Role:',
      value: 'CEO, GDGOC DLSU',
    },
  ];

  return (
    <Box
      id="about"
      component="section"
      sx={{
        py: { xs: 10, sm: 12, md: 12 },
        backgroundColor: 'background.alt',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
        <Grid container spacing={{ xs: 4, md: 6 }} alignItems="stretch">
          {/* Left Side - Text Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '100%',
                pr: { xs: 0, md: 4 },
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: '2.25rem', md: '3rem' },
                }}
              >
                About Me
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.7,
                  fontSize: '1rem',
                }}
              >
                I'm a Computer Systems Engineering student at De La Salle University Manila, expected to graduate in August 2027. My academic journey combines software development fundamentals with deep computer systems knowledge - from web development and databases to computer architecture, operating systems, and microprocessor interfacing.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.7,
                  fontSize: '1rem',
                }}
              >
                As Chief Executive Officer of Google Developer Group on Campus DLSU, I lead the development of internal tools and educational workshops. Previously as Chief Developer, I spearheaded projects that tripled membership from 120 to 360 members, including facial recognition systems, organizational portals, and AI-powered chatbots. I've also contributed to research - my OCR paper was accepted at the Philippine Computing Science Congress, completed in under 9 days.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  fontSize: '1rem',
                }}
              >
                What excites me most is building solutions that bridge theory and practice - whether it's developing full-stack hospital management systems, creating OS emulators in C++, or designing university-wide web platforms. I'm passionate about leveraging both low-level systems knowledge and modern web technologies to create impactful, scalable solutions.
              </Typography>
            </Box>
          </Grid>

          {/* Right Side - Quick Facts */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  color: 'primary.main',
                  fontSize: { xs: '1.75rem', md: '2rem' },
                  textAlign: 'center',
                }}
              >
                Quick Facts
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {quickFacts.map((fact, index) => (
                  <Box key={index}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: 'text.primary',
                      }}
                    >
                      {fact.label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                      }}
                    >
                      {fact.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
