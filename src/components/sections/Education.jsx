import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Avatar,
} from '@mui/material';
import { FiBookOpen } from 'react-icons/fi';
import { education } from '../../data/education';

const Education = () => {
  const getStatusColor = (statusColor) => {
    switch (statusColor) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getIconColor = (current) => {
    return current ? '#377dff' : '#f9b934';
  };

  return (
    <Box
      id="education"
      component="section"
      sx={{
        py: { xs: 10, sm: 12, md: 12 },
        backgroundColor: 'background.default',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 3, sm: 4 } }}>
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.25rem', md: '3rem' },
            }}
          >
            Education
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            My academic journey in computer science and engineering
          </Typography>
        </Box>

        {/* Education Cards Grid */}
        <Grid container spacing={4} sx={{ maxWidth: 1000, mx: 'auto' }}>
          {education.map((edu) => (
            <Grid size={{ xs: 12, md: 6 }} key={edu.id}>
              <Card
                sx={{
                  height: '100%',
                  border: edu.current ? '2px solid' : '1px solid',
                  borderColor: edu.current ? 'primary.main' : 'divider',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  {/* Icon and Degree */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: getIconColor(edu.current),
                        width: 42,
                        height: 42,
                        mr: 2,
                      }}
                    >
                      <FiBookOpen size={20} />
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          fontSize: { xs: '1.125rem', md: '1.25rem' },
                          lineHeight: 1.4,
                          mb: 0.5,
                        }}
                      >
                        {edu.degree}
                      </Typography>

                      {edu.major && (
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontWeight: 500,
                            mb: 1,
                          }}
                        >
                          {edu.major}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* Institution */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  >
                    {edu.institution}
                  </Typography>

                  {/* Date - Only show if exists */}
                  {edu.date && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                      }}
                    >
                      {edu.date}
                    </Typography>
                  )}

                  {/* Status - Only show if exists */}
                  {edu.status && (
                    <Chip
                      label={edu.status}
                      size="small"
                      color={getStatusColor(edu.statusColor)}
                      variant="outlined"
                      sx={{ mb: 3, fontSize: '0.8125rem' }}
                    />
                  )}

                  {/* Activities */}
                  {edu.activities && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary',
                        }}
                      >
                        Activities:
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {edu.activities}
                      </Typography>
                    </Box>
                  )}

                  {/* Skills - Only show if exists */}
                  {edu.skills && (
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: 'text.primary',
                        }}
                      >
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {edu.skills.map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.75rem',
                              height: 24,
                            }}
                          />
                        ))}
                        {edu.additionalSkills > 0 && (
                          <Chip
                            label={`+${edu.additionalSkills} more`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.75rem',
                              fontStyle: 'italic',
                              height: 24,
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Education;
