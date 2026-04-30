import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiSun, FiMoon, FiDownload } from 'react-icons/fi';
import { useThemeContext } from '../../context/ThemeContext';
import { scrollToSection } from '../../utils/helpers';
import { IconButton, Button, NavigationDrawer } from '../m3';
import './Navigation.css';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { rootMargin: '-100px 0px -80% 0px', threshold: 0 }
    );
    ['hero', ...navItems.map((n) => n.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    scrollToSection(id, isMobile ? 56 : 64);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${darkMode ? 'nav--dark' : 'nav--light'}`}>
        <div className="nav__container">
          <button className="nav__logo" onClick={() => handleNavClick('hero')}>
            Aebrahm Ramos
          </button>

          {!isMobile && (
            <div className="nav__desktop">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              ))}
              <IconButton onClick={toggleDarkMode} aria-label="Toggle dark mode">
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </IconButton>
              <Button
                variant="outlined"
                startIcon={<FiDownload />}
                href="/resume/ramos-aebrahm-resume.pdf"
                download
              >
                Resume
              </Button>
            </div>
          )}

          {isMobile && (
            <div className="nav__mobile-actions">
              <IconButton onClick={toggleDarkMode} aria-label="Toggle dark mode">
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </IconButton>
              <IconButton
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <FiMenu size={24} />
              </IconButton>
            </div>
          )}
        </div>
      </header>

      <NavigationDrawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <div className="drawer__inner">
          <div className="drawer__header">
            <IconButton onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <FiX size={24} />
            </IconButton>
          </div>
          <nav className="drawer__nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`drawer__item ${activeSection === item.id ? 'drawer__item--active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="drawer__footer">
            <Button
              variant="outlined"
              startIcon={<FiDownload />}
              href="/resume/ramos-aebrahm-resume.pdf"
              download
              fullWidth
            >
              Download Resume
            </Button>
          </div>
        </div>
      </NavigationDrawer>
    </>
  );
};

export default Navigation;
