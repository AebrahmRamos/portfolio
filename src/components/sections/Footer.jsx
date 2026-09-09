import React from 'react';
import { PiGithubLogoBold, PiLinkedinLogoBold, PiEnvelopeSimpleBold } from 'react-icons/pi';
import './Footer.css';

const navItems = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
];

const socials = [
  { label: 'GitHub', href: 'https://github.com/AebrahmRamos', icon: <PiGithubLogoBold size={18} /> },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/aebrahmramos', icon: <PiLinkedinLogoBold size={18} /> },
  { label: 'Email', href: 'mailto:aebrahmramos.dev@gmail.com', icon: <PiEnvelopeSimpleBold size={18} /> },
];

const Footer = () => (
  <footer className="footer">
    <div className="section__container footer__container">
      <div className="footer__top">
        <p className="m3-title-medium footer__name">Aebrahm Ramos</p>

        <nav className="footer__nav" aria-label="Footer">
          {navItems.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="footer__link">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="footer__socials">
          {socials.map((s) => (
            <a
              key={s.label}
              className="footer__social"
              href={s.href}
              aria-label={s.label}
              target={s.href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <p className="m3-body-small footer__copy">
          &copy; {new Date().getFullYear()} Aebrahm Ramos. All rights reserved
        </p>
        <p className="m3-body-small footer__place">Manila, Philippines</p>
      </div>
    </div>
  </footer>
);

export default Footer;
