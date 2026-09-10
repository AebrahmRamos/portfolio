import React, { useState, useRef } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import {
  PiEnvelopeSimpleBold,
  PiGithubLogoBold,
  PiLinkedinLogoBold,
  PiPaperPlaneTiltBold,
  PiArrowUpRightBold,
  PiDownloadSimpleBold,
} from 'react-icons/pi';
import emailjs from '@emailjs/browser';
import { TextField, Button, Banner, Progress } from '../m3';
import './Contact.css';

// Field names are unchanged (firstName, lastName, email, subject, message):
// the EmailJS template and any downstream tracking key off them.
const links = [
  {
    title: 'Email',
    value: 'aebrahmramos.dev@gmail.com',
    href: 'mailto:aebrahmramos.dev@gmail.com',
    icon: <PiEnvelopeSimpleBold size={18} />,
  },
  {
    title: 'LinkedIn',
    value: 'linkedin.com/in/aebrahmramos',
    href: 'https://linkedin.com/in/aebrahmramos',
    icon: <PiLinkedinLogoBold size={18} />,
  },
  {
    title: 'GitHub',
    value: 'github.com/AebrahmRamos',
    href: 'https://github.com/AebrahmRamos',
    icon: <PiGithubLogoBold size={18} />,
  },
];

const EMPTY = { firstName: '', lastName: '', email: '', subject: '', message: '' };

const Contact = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formData, setFormData] = useState(EMPTY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // The form used to disable its submit button until every required field was
  // filled, with noValidate set and no per-field error state. Nothing told you
  // which field was missing: the button was simply dead. It now stays enabled,
  // and submitting names the problem on the field itself.
  const validate = (data) => {
    const next = {};
    if (!data.firstName.trim()) next.firstName = 'Enter your first name.';
    if (!data.lastName.trim()) next.lastName = 'Enter your last name.';
    if (!data.email.trim()) next.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) next.email = 'That email address does not look right.';
    if (!data.message.trim()) next.message = 'Tell me what you are working on.';
    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error while it is being corrected, rather than leaving
    // it flagged until the next submit.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const found = validate(formData);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setSubmitStatus(null);
      formRef.current?.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus();
      return;
    }

    setErrors({});
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
      setFormData(EMPTY);
      setErrors({});
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="section__container">
        <div className="section__header">
          <h2 className="m3-display-small section__title">Get in touch</h2>
          <p className="m3-body-large section__subtitle">
            Freelance work, full-time roles, or a question about something I built.
          </p>
          <hr className="section__rule" />
        </div>

        <div className="contact__grid">
          <form className="contact__form" ref={formRef} onSubmit={handleSubmit} noValidate>
            <div role="status" aria-live="polite" aria-atomic="true">
              {submitStatus === 'success' && (
                <Banner severity="success" className="contact__banner">
                  Message sent. I will get back to you soon.
                </Banner>
              )}
              {submitStatus === 'error' && (
                <Banner severity="error" className="contact__banner">
                  That did not send. Please try again, or email me directly.
                </Banner>
              )}
            </div>

            <div className="contact__row">
              <TextField
                label="First name"
                name="firstName"
                error={errors.firstName}
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                label="Last name"
                name="lastName"
                error={errors.lastName}
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <TextField
              label="Email"
              name="email"
              error={errors.email}
              type="email"
              autoComplete="email"
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
              error={errors.message}
              multiline
              rows={6}
              required
              value={formData.message}
              onChange={handleChange}
              helperText="What are you building, and where do you need help?"
            />

            <Button
              type="submit"
              variant="filled"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <Progress size={16} /> : <PiPaperPlaneTiltBold />}
            >
              {isSubmitting ? 'Sending' : 'Send message'}
            </Button>
          </form>

          <aside className="contact__aside">
            <ul className="contact__links">
              {links.map((link) => (
                <li key={link.title}>
                  <a
                    className="contact__link"
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                  >
                    <span className="contact__link-icon" aria-hidden="true">{link.icon}</span>
                    <span className="contact__link-text">
                      <span className="m3-label-medium contact__link-title">{link.title}</span>
                      <span className="m3-body-medium contact__link-value">{link.value}</span>
                    </span>
                    <PiArrowUpRightBold className="contact__link-arrow" size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>

            {/* The resume section used to be a full-width primary slab with its
                own heading, two CTAs, a nested "What's Inside" panel and a PDF
                viewer dialog. In dark mode that slab was a light-blue block in
                the middle of a dark page. It is one row now; the #resume anchor
                stays so existing links still land. */}
            <div id="resume" className="contact__resume">
              <div>
                <p className="m3-title-small contact__resume-title">Resume</p>
                <p className="m3-body-small contact__resume-note">
                  One page, PDF, updated April 2026.
                </p>
              </div>
              <Button
                variant="outlined"
                startIcon={<PiDownloadSimpleBold />}
                href="/resume/ramos-aebrahm-resume.pdf"
                download
              >
                Download
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Contact;
