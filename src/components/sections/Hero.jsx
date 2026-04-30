import React from 'react';
import { FiMail, FiBriefcase } from 'react-icons/fi';
import { scrollToSection } from '../../utils/helpers';
import { Button } from '../m3';
import localProfile from '../../assets/profile.jpg';
import './Hero.css';

const remoteProfile = 'https://wcnushafgkumpgjy.public.blob.vercel-storage.com/IMG_9191-2.jpg';

const Hero = () => {
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
            Specializing in full-stack development, system design, and AI-powered solutions.
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
          <img
            className="hero__image"
            src={remoteProfile}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = localProfile;
            }}
            alt="Aebrahm Ramos"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
