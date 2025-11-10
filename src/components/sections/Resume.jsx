import React, { useState } from 'react';
import { Box, Container, Typography, Button, Grid, Paper, Modal, IconButton } from '@mui/material';
import { FiDownload, FiExternalLink, FiFileText, FiX } from 'react-icons/fi';

const Resume = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

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
              onClick={handleOpenModal}
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
            Last updated: November 10, 2025 • Available in PDF format
          </Typography>
        </Box>
      </Container>

      {/* PDF Viewer Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="resume-modal-title"
        aria-describedby="resume-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90vw',
            height: '90vh',
            backgroundColor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" id="resume-modal-title">
              Resume - Aebrahm Ramos
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              aria-label="Close resume viewer"
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <FiX size={24} />
            </IconButton>
          </Box>

          {/* PDF Viewer */}
          <Box
            sx={{
              width: '100%',
              height: 'calc(100% - 64px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <object
              data="/resume/resume-aebrahm-ramos.pdf#toolbar=1&navpanes=0&scrollbar=1"
              type="application/pdf"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            >
              <Box
                sx={{
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Your browser doesn't support embedded PDFs.
                </Typography>
                <Button
                  variant="contained"
                  href="/resume/resume-aebrahm-ramos.pdf"
                  download
                  startIcon={<FiDownload />}
                >
                  Download PDF Instead
                </Button>
              </Box>
            </object>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Resume;
