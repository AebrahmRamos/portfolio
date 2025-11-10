import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Button,
  Modal,
  IconButton,
  Link
} from '@mui/material';
import { Code, OpenInNew, Close, GitHub } from '@mui/icons-material';
import { projects } from '../../data/projects';

const Projects = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProject(null);
  };

  return (
    <Box 
      id="projects" 
      sx={{ 
        py: 10,
        background: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, rgba(15,20,25,0) 0%, rgba(102, 192, 200, 0.05) 50%, rgba(15,20,25,0) 100%)'
            : 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(55, 125, 255, 0.03) 50%, rgba(255,255,255,0) 100%)'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 2,
              background: (theme) => 
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, #66C0C8 0%, #7BB8E2 100%)'
                  : 'linear-gradient(135deg, #377DFF 0%, #1E5EFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Featured Projects
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            A selection of projects showcasing my technical skills and problem-solving abilities
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => 
                      theme.palette.mode === 'dark'
                        ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                        : '0 8px 24px rgba(0, 0, 0, 0.1)',
                  }
                }}
                onClick={() => handleOpenModal(project)}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Code sx={{ mr: 1, color: 'primary.main', fontSize: 24 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                      {project.title}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      flexGrow: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {project.description}
                  </Typography>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <Chip 
                        key={idx} 
                        label={tech} 
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: 24,
                          backgroundColor: (theme) => 
                            theme.palette.mode === 'dark' 
                              ? 'rgba(102, 192, 200, 0.15)' 
                              : 'rgba(55, 125, 255, 0.08)',
                          color: 'primary.main',
                          fontWeight: 500
                        }}
                      />
                    ))}
                    {project.technologies.length > 3 && (
                      <Chip 
                        label={`+${project.technologies.length - 3}`}
                        size="small"
                        sx={{ 
                          fontSize: '0.7rem',
                          height: 24,
                          backgroundColor: (theme) => 
                            theme.palette.mode === 'dark' 
                              ? 'rgba(155, 163, 175, 0.1)' 
                              : 'rgba(0, 0, 0, 0.05)',
                          color: (theme) =>
                            theme.palette.mode === 'dark'
                              ? 'text.secondary'
                              : 'text.primary',
                          fontWeight: 500
                        }}
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Project Detail Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="project-modal-title"
        aria-describedby="project-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 800,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Modal Header */}
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: 1, 
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Code sx={{ mr: 1.5, color: 'primary.main', fontSize: 28 }} />
              <Typography id="project-modal-title" variant="h5" sx={{ fontWeight: 600 }}>
                {selectedProject?.title}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseModal} size="small">
              <Close />
            </IconButton>
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
            {/* Project Image (if available) */}
            {selectedProject?.image && (
              <Box 
                sx={{ 
                  mb: 3,
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Box
                  component="img"
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 400,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.target.style.display = 'none';
                  }}
                />
              </Box>
            )}

            <Typography 
              id="project-modal-description" 
              variant="body1" 
              sx={{ mb: 3, lineHeight: 1.7 }}
            >
              {selectedProject?.fullDescription || selectedProject?.description}
            </Typography>

            {selectedProject?.features && selectedProject.features.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                  Key Features
                </Typography>
                <Box component="ul" sx={{ pl: 2.5, m: 0 }}>
                  {selectedProject.features.map((feature, idx) => (
                    <Typography 
                      component="li" 
                      key={idx} 
                      variant="body2" 
                      sx={{ mb: 1, lineHeight: 1.6 }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                Technologies Used
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedProject?.technologies.map((tech, idx) => (
                  <Chip 
                    key={idx} 
                    label={tech}
                    sx={{ 
                      backgroundColor: (theme) => 
                        theme.palette.mode === 'dark' 
                          ? 'rgba(102, 192, 200, 0.15)' 
                          : 'rgba(55, 125, 255, 0.08)',
                      color: 'primary.main',
                      fontWeight: 500
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {selectedProject?.liveUrl && (
                <Button
                  variant="contained"
                  startIcon={<OpenInNew />}
                  component={Link}
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flexGrow: 1, minWidth: 140 }}
                >
                  Live Demo
                </Button>
              )}
              {selectedProject?.githubUrl && (
                <Button
                  variant="outlined"
                  startIcon={<GitHub />}
                  component={Link}
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ flexGrow: 1, minWidth: 140 }}
                >
                  View Code
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Projects;
