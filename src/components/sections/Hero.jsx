import React, { useState, useEffect } from 'react';
import { FiMail, FiBriefcase } from 'react-icons/fi';
import { scrollToSection } from '../../utils/helpers';
import { Button } from '../m3';
import localProfile from '../../assets/profile.jpg';
import './Hero.css';

const remoteProfile = 'https://wcnushafgkumpgjy.public.blob.vercel-storage.com/IMG_9191-2.jpg';

const ROLES = ['full-stack development', 'system design', 'AI-powered solutions'];
const ROLES_SENTENCE = 'full-stack development, system design, and AI-powered solutions';
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Hero = () => {
  // Reduced-motion users get the full static sentence instead of a cycling word,
  // so no specialization is dropped for them (or for reduced-motion crawlers).
  const [reduced] = useState(prefersReducedMotion);
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setRoleIdx(i => (i + 1) % ROLES.length), 2600);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <section id="hero" className="hero">
      <div className="hero__container">
        <div className="hero__text">
          <p className="hero__greeting m3-display-large">Hi, I'm</p>
          <div className="hero__name-wrap">
            <h1 className="hero__name m3-display-large">Aebrahm Ramos</h1>
            <span className="hero__name-accent" aria-hidden="true" />
          </div>

          <p className="hero__desc m3-headline-small">
            Computer Systems Engineering student at De La Salle University Manila, graduating August 2027.
          </p>
          <p className="hero__desc m3-headline-small">
            Specializing in{' '}
            {reduced
              ? ROLES_SENTENCE
              : <span key={roleIdx} className="hero__role">{ROLES[roleIdx]}</span>}.
          </p>

          <div className="hero__ctas">
            <Button
              variant="filled"
              size="large"
              startIcon={<FiMail />}
              onClick={() => scrollToSection('contact')}
            >
              Get in touch
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<FiBriefcase />}
              onClick={() => scrollToSection('projects')}
            >
              View my work
            </Button>
          </div>
        </div>

        <div className="hero__image-wrap">
          <div className="hero__image-frame">
            <img
              className="hero__image"
              src={remoteProfile}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = localProfile;
              }}
              alt="Aebrahm Ramos"
              width="380"
              height="380"
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
