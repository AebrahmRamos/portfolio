import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { FiDownload, FiExternalLink, FiFileText } from 'react-icons/fi';

const Resume = () => {
  const resumeFeatures = [
    {
      col1: ['Education & Academic Background', 'Technical Skills & Expertise'],
      col2: ['Project Portfolio', 'Professional Experience'],
    },
    {
      col1: ['Research Experience', 'Contact Information'],
      col2: [],
    },
  ];

  return (
    <Box
      id="resume"
      component="section"
      sx={{
        py: { xs: 10, sm: 12, md: 12 },
        backgroundColor: 'primary.main',
        color: 'white',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Icon */}
          <FiFileText size={60} style={{ marginBottom: 24 }} />

          {/* Title */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: '2.25rem', md: '3rem' },
            }}
          >
            Download My Resume
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              mb: 6,
              opacity: 0.9,
              maxWidth: 700,
              mx: 'auto',
            }}
          >
            Get a comprehensive overview of my education, experience, and skills
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'center',
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              mb: 6,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<FiDownload />}
              href="/resume/resume-aebrahm-ramos.pdf"
              download
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                minHeight: 56,
                px: 4,
                fontSize: '1.125rem',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
            >
              Download PDF Resume
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<FiExternalLink />}
              href="/resume/resume-aebrahm-ramos.pdf"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: 'white',
                color: 'white',
                minHeight: 56,
                px: 4,
                fontSize: '1.125rem',
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              View Online
            </Button>
          </Box>

          {/* What's Inside */}
          <Paper
            sx={{
              maxWidth: 600,
              mx: 'auto',
              p: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                fontSize: '1.25rem',
                color: 'white',
              }}
            >
              What's Inside
            </Typography>

            <Grid container spacing={2}>
              {resumeFeatures.map((section, sectionIdx) => (
                <React.Fragment key={sectionIdx}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    {section.col1.map((feature, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            flexShrink: 0,
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            textAlign: 'left',
                          }}
                        >
                          {feature}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                  {section.col2.length > 0 && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      {section.col2.map((feature, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: 'white',
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            variant="body1"
                            sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              textAlign: 'left',
                            }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Grid>
                  )}
                </React.Fragment>
              ))}
            </Grid>
          </Paper>

          {/* Last Updated */}
          <Typography
            variant="body2"
            sx={{
              mt: 4,
              opacity: 0.7,
            }}
          >
            Last updated: May 2025 • Available in PDF format
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Resume;
