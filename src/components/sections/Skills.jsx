import React from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, Chip } from '@mui/material';
import {
  FiMonitor,
  FiCode,
  FiDatabase,
  FiTool,
} from 'react-icons/fi';
import { skills, mernStack } from '../../data/skills';

const Skills = () => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Web':
        return <FiMonitor size={30} />;
      case 'Code':
        return <FiCode size={30} />;
      case 'Storage':
        return <FiDatabase size={30} />;
      case 'Tools':
        return <FiTool size={30} />;
      default:
        return <FiCode size={30} />;
    }
  };

  const skillCategories = [
    { key: 'frontend', data: skills.frontend },
    { key: 'backend', data: skills.backend },
    { key: 'database', data: skills.database },
    { key: 'tools', data: skills.tools },
  ];

  return (
    <Box
      id="skills"
      component="section"
      sx={{
        py: { xs: 8, sm: 10, md: 10 },
        backgroundColor: 'background.alt',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 5 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 1.5,
              fontSize: { xs: '2.25rem', md: '3rem' },
            }}
          >
            Skills & Technologies
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Technical expertise across the full-stack development spectrum
          </Typography>
        </Box>

        {/* Skills Cards */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {skillCategories.map(({ key, data }) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={key}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: data.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {getIcon(data.icon)}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      fontSize: '1.125rem',
                    }}
                  >
                    {data.title}
                  </Typography>

                  {/* Skills List */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.5,
                    }}
                  >
                    {data.skills.map((skill, index) => (
                      <Box
                        key={index}
                        sx={{
                          py: 0.5,
                          px: 2,
                          borderRadius: 1,
                          backgroundColor: 'background.default',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                          }}
                        >
                          {skill}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* MERN Stack Proficiency */}
        <Box
          sx={{
            textAlign: 'center',
            p: 3,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '1.125rem', md: '1.375rem' },
            }}
          >
            MERN Stack Proficiency
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            {mernStack.map((tech) => (
              <Chip
                key={tech.id}
                label={tech.name}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  py: 2.5,
                  px: 2,
                  height: 'auto',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  backgroundColor: 'background.default',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Skills;
