import React, { Suspense, lazy } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Loading from './components/common/Loading';

// Lazy-load below-the-fold sections for better initial bundle size
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Education = lazy(() => import('./components/sections/Education'));
const Organizations = lazy(() => import('./components/sections/Organizations'));
const Contact = lazy(() => import('./components/sections/Contact'));
const Resume = lazy(() => import('./components/sections/Resume'));
const Footer = lazy(() => import('./components/sections/Footer'));

function App() {
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaSiteKey}>
      <ThemeProvider>
        <Layout>
          <Hero />
          <About />
          <Suspense fallback={<Loading />}>
            <Experience />
            <Projects />
            <Skills />
            <Education />
            <Organizations />
            <Contact />
            <Resume />
            <Footer />
          </Suspense>
        </Layout>
      </ThemeProvider>
    </GoogleReCaptchaProvider>
  );
}

export default App;
