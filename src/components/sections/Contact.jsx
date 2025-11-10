import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { FiMail, FiSend, FiLinkedin, FiGithub } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Verify reCAPTCHA
      if (!executeRecaptcha) {
        console.error('reCAPTCHA not ready');
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      const recaptchaToken = await executeRecaptcha('contact_form');

      // EmailJS configuration from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        subject: formData.subject || 'Portfolio Contact Form',
        message: formData.message,
        to_name: 'Aebrahm Ramos',
        'g-recaptcha-response': recaptchaToken, // Include reCAPTCHA token
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSubmitStatus('success');
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Email send failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.message;

  const contactInfo = [
    {
      title: 'Email',
      value: 'aebrahmramos.dev@gmail.com',
      link: 'mailto:aebrahmramos.dev@gmail.com',
      icon: <FiMail size={24} />,
      color: '#377dff',
    },
    {
      title: 'LinkedIn',
      value: 'linkedin.com/in/aebrahmramos',
      link: 'https://linkedin.com/in/aebrahmramos',
      icon: <FiLinkedin size={24} />,
      color: '#0077B5',
    },
    {
      title: 'GitHub',
      value: 'github.com/AebrahmRamos',
      link: 'https://github.com/AebrahmRamos',
      icon: <FiGithub size={24} />,
      color: '#333',
    },
  ];

  return (
    <Box
      id="contact"
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
            Let's Get In Touch
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
            I'm always open to discussing new opportunities, projects, or just connecting with
            fellow developers
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: 'background.alt',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, sm: 3, md: 4 } }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  }}
                >
                  Send a Message
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Message sent successfully! I'll get back to you soon.
                    </Alert>
                  )}
                  {submitStatus === 'error' && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      Failed to send message. Please try again or contact me directly.
                    </Alert>
                  )}

                  <Grid container spacing={{ xs: 2, sm: 2.5 }}>
                    {/* First Name */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                          '& .MuiInputBase-root': {
                            minHeight: 48,
                          },
                        }}
                      />
                    </Grid>

                    {/* Last Name */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        required
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                          '& .MuiInputBase-root': {
                            minHeight: 48,
                          },
                        }}
                      />
                    </Grid>

                    {/* Email */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        type="email"
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                          '& .MuiInputBase-root': {
                            minHeight: 48,
                          },
                        }}
                      />
                    </Grid>

                    {/* Subject */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                          '& .MuiInputBase-root': {
                            minHeight: 48,
                          },
                        }}
                      />
                    </Grid>

                    {/* Message */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        required
                        multiline
                        rows={5}
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your project or just say hello!"
                        variant="outlined"
                      />
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={!isFormValid || isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size={20} /> : <FiSend />}
                        sx={{ minHeight: 52, fontSize: '1rem', py: 1.5 }}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Footer Note */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mt: 3,
                      textAlign: 'center',
                      lineHeight: 1.6,
                    }}
                  >
                    I typically respond within 24-48 hours. Looking forward to hearing from you!
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: '1.75rem', md: '2rem' },
                }}
              >
                Contact Information
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {contactInfo.map((info, index) => (
                  <Card
                    key={index}
                    component="a"
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textDecoration: 'none',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 3,
                      }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          backgroundColor: info.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: '1.25rem',
                          }}
                        >
                          {info.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                          }}
                        >
                          {info.value}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              {/* Quick Connect */}
              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    fontSize: '1.25rem',
                  }}
                >
                  Quick Connect
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FiGithub />}
                    href="https://github.com/AebrahmRamos"
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    sx={{ minHeight: 48 }}
                  >
                    GitHub
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FiLinkedin />}
                    href="https://linkedin.com/in/aebrahmramos"
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                    sx={{ minHeight: 48 }}
                  >
                    LinkedIn
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
