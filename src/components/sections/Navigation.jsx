import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PiListBold, PiXBold, PiSunBold, PiMoonBold, PiDownloadSimpleBold } from 'react-icons/pi';
import { useThemeContext } from '../../context/ThemeContext';
import { IconButton, Button, NavigationDrawer } from '../m3';
import './Navigation.css';

// Labels and order are unchanged; they are the site's primary nav.
const navItems = [
  { label: 'About', id: 'about' },
  { label: 'Experience', id: 'experience' },
  { label: 'Projects', id: 'projects' },
  { label: 'Skills', id: 'skills' },
  { label: 'Education', id: 'education' },
  { label: 'Organizations', id: 'organizations' },
  { label: 'Contact', id: 'contact' },
];

const Navigation = () => {
  const { darkMode, toggleDarkMode } = useThemeContext();
  const { pathname } = useLocation();
  const isPortfolio = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const sentinel = useRef(null);

  // Scrolled state via a sentinel instead of a scroll listener. The old
  // version ran a handler on every scroll frame to compare scrollY > 20.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Active-section highlight. Only the portfolio route has these targets.
  useEffect(() => {
    if (!isPortfolio) return undefined;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { rootMargin: '-96px 0px -70% 0px', threshold: 0 }
    );
    ['hero', ...navItems.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isPortfolio]);

  // Close the drawer on route change so a back/forward never leaves it open.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <span ref={sentinel} className="nav__sentinel" aria-hidden="true" />

      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__container">
          <Link to="/" className="nav__logo">Aebrahm Ramos</Link>

          {/* Section links are real anchors now, not buttons calling a scroll
              helper: they are crawlable, deep-linkable and keyboard-native.
              They only render on the portfolio route, where the targets exist. */}
          {isPortfolio && (
            <nav className="nav__desktop" aria-label="Primary">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
                  aria-current={activeSection === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}

          <div className="nav__actions">
            <IconButton
              onClick={toggleDarkMode}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {darkMode ? <PiSunBold size={18} /> : <PiMoonBold size={18} />}
            </IconButton>

            <Button
              className="nav__resume"
              variant="outlined"
              size="small"
              startIcon={<PiDownloadSimpleBold />}
              href="/resume/ramos-aebrahm-resume.pdf"
              download
            >
              Resume
            </Button>

            {isPortfolio && (
              <IconButton
                className="nav__menu-btn"
                onClick={() => setMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={menuOpen}
              >
                <PiListBold size={20} />
              </IconButton>
            )}
          </div>
        </div>
      </header>

      {/* Gated on the portfolio route for the same reason as the desktop nav:
          its links are in-page anchors. Rendered unconditionally, the drawer
          left seven dead #section links in the DOM on every blog route, which
          the hamburger did not even expose but a screen reader still reached. */}
      {isPortfolio && (
      <NavigationDrawer open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="drawer__inner">
          <div className="drawer__header">
            <IconButton onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <PiXBold size={20} />
            </IconButton>
          </div>
          <nav className="drawer__nav" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`drawer__item ${activeSection === item.id ? 'drawer__item--active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="drawer__footer">
            <Button
              variant="outlined"
              startIcon={<PiDownloadSimpleBold />}
              href="/resume/ramos-aebrahm-resume.pdf"
              download
              fullWidth
            >
              Resume
            </Button>
          </div>
        </div>
      </NavigationDrawer>
      )}
    </>
  );
};

export default Navigation;
