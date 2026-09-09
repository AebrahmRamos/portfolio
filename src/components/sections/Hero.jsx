import React from 'react';
import { PiArrowRightBold, PiGithubLogoBold, PiLinkedinLogoBold } from 'react-icons/pi';
import { scrollToSection } from '../../utils/helpers';
import { Button } from '../m3';
import profileImg from '../../assets/profile.webp';
import './Hero.css';

// Four text elements, hard cap: eyebrow-equivalent status line, headline,
// subtext, CTAs. The old hero had five ("Hi, I'm" at display size, the name,
// two description paragraphs, CTAs) and on a 390x844 phone the second CTA
// landed below the fold.
//
// The cycling "Specializing in <word>" interval and the 6s photo float are
// gone: both looped forever and communicated nothing, and the cycling word
// meant two of the three specialisms were always hidden.
const Hero = () => (
  <section id="hero" className="hero">
    <div className="hero__container">
      <div className="hero__text">
        <p className="hero__status">
          <span className="hero__status-dot" aria-hidden="true" />
          Available for freelance and full-time work
        </p>

        <h1 className="hero__headline m3-display-large">
          Internal tools that run real businesses.
        </h1>

        <p className="hero__lead m3-body-large">
          I am Aebrahm Ramos, a full-stack engineer in Manila building inventory
          forecasting, order systems, and AI tooling.
        </p>

        <div className="hero__actions">
          <Button
            variant="filled"
            size="large"
            endIcon={<PiArrowRightBold />}
            onClick={() => scrollToSection('projects')}
          >
            See the work
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => scrollToSection('contact')}
          >
            Get in touch
          </Button>

          <span className="hero__socials">
            <a
              className="hero__social"
              href="https://github.com/AebrahmRamos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
            >
              <PiGithubLogoBold size={20} />
            </a>
            <a
              className="hero__social"
              href="https://linkedin.com/in/aebrahmramos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
            >
              <PiLinkedinLogoBold size={20} />
            </a>
          </span>
        </div>
      </div>

      <div className="hero__media">
        <img
          className="hero__image"
          src={profileImg}
          alt="Aebrahm Ramos"
          width="420"
          height="420"
          fetchPriority="high"
          decoding="async"
        />
      </div>
    </div>
  </section>
);

export default Hero;
