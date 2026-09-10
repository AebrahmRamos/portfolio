import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Loading from './components/common/Loading';
import Reveal from './components/common/Reveal';
import { useDocumentTitle } from './utils/useDocumentTitle';

// Lazy-load below-the-fold portfolio sections.
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Education = lazy(() => import('./components/sections/Education'));
const Organizations = lazy(() => import('./components/sections/Organizations'));
const Contact = lazy(() => import('./components/sections/Contact'));
const Footer = lazy(() => import('./components/sections/Footer'));

// Lazy-load blog and admin (separate code-split bundles).
const BlogIndex = lazy(() => import('./components/blog/BlogIndex'));
const BlogPost = lazy(() => import('./components/blog/BlogPost'));
const BlogSeries = lazy(() => import('./components/blog/BlogSeries'));
const AdminPanel = lazy(() => import('./components/admin/AdminPanel'));

// The Resume section is gone as a standalone block; it is one row inside
// Contact now, which still carries id="resume" so /#resume keeps working.
function PortfolioPage() {
  // Matches the <title> in index.html so a client-side return to / does not
  // downgrade the tab to the bare site name.
  useDocumentTitle('Aebrahm Ramos - Full-Stack Developer', { suffix: false });

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <Hero />
      <Reveal><About /></Reveal>
      <Suspense fallback={<Loading />}>
        <Reveal><Experience /></Reveal>
        <Reveal><Projects /></Reveal>
        <Reveal><Skills /></Reveal>
        <Reveal><Education /></Reveal>
        <Reveal><Organizations /></Reveal>
        <Reveal><Contact /></Reveal>
        <Footer />
      </Suspense>
    </GoogleReCaptchaProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/series/:slug" element={<BlogSeries />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin/*" element={<AdminPanel />} />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
