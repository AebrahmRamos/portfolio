import React, { Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Education from './components/sections/Education';
import Skills from './components/sections/Skills';
import Loading from './components/common/Loading';

// Lazy-load below-the-fold sections for better initial bundle size
const Projects = lazy(() => import('./components/sections/Projects'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Organizations = lazy(() => import('./components/sections/Organizations'));
const Contact = lazy(() => import('./components/sections/Contact'));
const Resume = lazy(() => import('./components/sections/Resume'));
const Footer = lazy(() => import('./components/sections/Footer'));

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Hero />
        <About />
        <Education />
        <Skills />
        <Suspense fallback={<Loading />}>
          <Projects />
          <Experience />
          <Organizations />
          <Contact />
          <Resume />
          <Footer />
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
