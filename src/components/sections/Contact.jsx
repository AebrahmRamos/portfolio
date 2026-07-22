import React, { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { FiMail, FiSend, FiLinkedin, FiGithub } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import { Card, TextField, Button, Banner, Progress } from '../m3';
import './Contact.css';

const contactInfo = [
  {
    title: 'Email',
    value: 'aebrahmramos.dev@gmail.com',
    link: 'mailto:aebrahmramos.dev@gmail.com',
    icon: <FiMail size={22} />,
    color: 'var(--md-sys-color-primary)',
  },
  {
    title: 'LinkedIn',
    value: 'linkedin.com/in/aebrahmramos',
    link: 'https://linkedin.com/in/aebrahmramos',
    icon: <FiLinkedin size={22} />,
    color: '#0077B5',
  },
  {
    title: 'GitHub',
    value: 'github.com/AebrahmRamos',
    link: 'https://github.com/AebrahmRamos',
    icon: <FiGithub size={22} />,
    color: 'var(--md-sys-color-on-surface)',
  },
];

const Contact = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', subject: '', message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      if (!executeRecaptcha) {
        setSubmitStatus('error');
        return;
      }
      const recaptchaToken = await executeRecaptcha('contact_form');
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          subject: formData.subject || 'Portfolio Contact Form',
          message: formData.message,
          to_name: 'Aebrahm Ramos',
          'g-recaptcha-response': recaptchaToken,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSubmitStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && formData.message;

  return (
    <section id="contact" className="contact">
      <div className="section__container">
        <div className="section__header">
          <h2 className="m3-display-small section__title">Let's Get In Touch</h2>
          <p className="m3-body-large section__subtitle">
            I'm always open to discussing new opportunities, projects, or just connecting with fellow developers
          </p>
        </div>

        <div className="contact__grid">
          <Card variant="filled" className="contact__form-card">
            <div className="m3-card__content">
              <h3 className="m3-headline-medium contact__form-heading">Send a Message</h3>

              <form className="contact__form" onSubmit={handleSubmit} noValidate>
                <div role="status" aria-live="polite" aria-atomic="true">
                  {submitStatus === 'success' && (
                    <Banner severity="success" className="contact__banner">
                      Message sent! I'll get back to you soon.
                    </Banner>
                  )}
                  {submitStatus === 'error' && (
                    <Banner severity="error" className="contact__banner">
                      Failed to send. Please try again or contact me directly.
                    </Banner>
                  )}
                </div>

                <div className="contact__row">
                  <TextField
                    label="First Name"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                <TextField
                  label="Message"
                  name="message"
                  multiline
                  rows={5}
                  required
                  placeholder="Tell me about your project or just say hello!"
                  value={formData.message}
                  onChange={handleChange}
                />

                <Button
                  type="submit"
                  variant="filled"
                  fullWidth
                  disabled={!isFormValid || isSubmitting}
                  size="large"
                  startIcon={isSubmitting ? <Progress size={18} /> : <FiSend />}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>

                <p className="m3-body-small contact__note">
                  I typically respond within 24-48 hours. Looking forward to hearing from you!
                </p>
              </form>
            </div>
          </Card>

          <div className="contact__info">
            <h3 className="m3-headline-medium contact__info-heading">Contact Information</h3>
            <div className="contact__links">
              {contactInfo.map((info) => (
                <Card
                  key={info.title}
                  variant="elevated"
                  interactive
                  as="a"
                  href={info.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact__link-card"
                >
                  <div className="m3-card__content contact__link-content">
                    <span className="contact__link-icon" style={{ color: info.color }}>
                      {info.icon}
                    </span>
                    <div>
                      <p className="m3-title-medium">{info.title}</p>
                      <p className="m3-body-small contact__link-value">{info.value}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="contact__quick">
              <p className="m3-title-medium contact__quick-title">Quick Connect</p>
              <div className="contact__quick-btns">
                <Button
                  variant="outlined"
                  startIcon={<FiGithub />}
                  href="https://github.com/AebrahmRamos"
                  target="_blank"
                  rel="noopener noreferrer"
                  fullWidth
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
                >
                  LinkedIn
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
