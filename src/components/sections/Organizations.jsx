import { Box, Container, Typography, Card, CardContent, Chip } from '@mui/material';
import { School, Code, Groups } from '@mui/icons-material';
import { organizations } from '../../data/organizations';

const Organizations = () => {
  const getIcon = (orgName) => {
    if (orgName.includes('Google') || orgName.includes('ACM')) return <Code />;
    if (orgName.includes('USG') || orgName.includes('Student Government')) return <Groups />;
    return <School />;
  };

  return (
    <Box
      id="organizations"
      sx={{
        py: { xs: 8, sm: 10, md: 10 },
        backgroundColor: 'background.default',
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
                  ? 'linear-gradient(135deg, #D88A8E 0%, #C8A2D0 100%)'
                  : 'linear-gradient(135deg, #377DFF 0%, #1E5EFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Student Organizations
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Leadership roles and contributions to university organizations
          </Typography>
        </Box>

        {/* Timeline Container */}
        <Box sx={{ position: 'relative', pl: { xs: 4, md: 6 } }}>
          {/* Timeline Line */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: '12px', md: '20px' },
              top: 0,
              bottom: 0,
              width: '2px',
              background: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(180deg, rgba(216, 138, 142, 0.4) 0%, rgba(216, 138, 142, 0.1) 100%)'
                  : 'linear-gradient(180deg, rgba(55, 125, 255, 0.3) 0%, rgba(55, 125, 255, 0.1) 100%)',
            }}
          />

          {organizations.map((org, orgIndex) => (
            <Box key={org.id} sx={{ position: 'relative', mb: 4 }}>
              {/* Timeline Node */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: '-32px', md: '-44px' },
                  top: '24px',
                  width: { xs: '32px', md: '48px' },
                  height: { xs: '32px', md: '48px' },
                  borderRadius: '50%',
                  backgroundColor: 'background.paper',
                  border: 2,
                  borderColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 0 0 4px rgba(102, 192, 200, 0.15)'
                      : '0 0 0 4px rgba(55, 125, 255, 0.08)',
                  zIndex: 2,
                  '& svg': {
                    fontSize: { xs: '18px', md: '24px' },
                  },
                }}
              >
                {getIcon(org.organization)}
              </Box>

              {/* Organization Card */}
              <Card
                sx={{
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? '0 2px 8px rgba(255, 255, 255, 0.04)'
                      : '0 2px 8px rgba(0, 0, 0, 0.08)',
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {org.organization}
                  </Typography>

                  {/* Positions */}
                  {org.positions.map((position, posIndex) => (
                    <Box
                      key={position.id}
                      sx={{
                        mb: posIndex < org.positions.length - 1 ? 3 : 0,
                        pb: posIndex < org.positions.length - 1 ? 3 : 0,
                        borderBottom:
                          posIndex < org.positions.length - 1
                            ? 1
                            : 0,
                        borderColor: 'divider',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'space-between',
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          mb: 1.5,
                          gap: 1,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {position.title}
                          </Typography>
                          {position.current && (
                            <Chip
                              label="Current"
                              size="small"
                              color="primary"
                              sx={{ height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}
                        >
                          {position.date}
                        </Typography>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {position.description}
                      </Typography>

                      {position.responsibilities && position.responsibilities.length > 0 && (
                        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                          {position.responsibilities.map((resp, idx) => (
                            <Typography
                              component="li"
                              key={idx}
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5, fontSize: '0.875rem' }}
                            >
                              {resp}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Organizations;
