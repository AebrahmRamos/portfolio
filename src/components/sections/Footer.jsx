import React from 'react';
import { scrollToSection } from '../../utils/helpers';
import './Footer.css';

const navItems = [
  { label: 'About', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Experience', id: 'experience' },
  { label: 'Contact', id: 'contact' },
];

const Footer = () => (
  <footer className="footer">
    <div className="footer__container">
      <div className="footer__top">
        <div className="footer__brand">
          <span className="m3-title-large footer__name">Aebrahm</span>
          <span className="m3-title-large footer__name">Ramos</span>
        </div>
        <nav className="footer__nav" aria-label="Footer navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className="footer__link"
              onClick={() => scrollToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <hr className="footer__divider" />

      <div className="footer__bottom">
        <p className="m3-body-small footer__copy">
          &copy; 2025 Aebrahm Ramos. All rights reserved
        </p>
        <p className="m3-body-small footer__tagline">
          Computer Systems Engineering Student at De La Salle University Manila. Specializing in MERN
          stack development and organizational management systems.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
