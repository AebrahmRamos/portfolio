import React from 'react';
import { Card } from '../m3';
import './About.css';

const quickFacts = [
  { label: 'University:', value: 'DLSU Manila' },
  { label: 'Program and Major:', value: 'Computer Science major in Computer Systems Engineering' },
  { label: 'Expected Graduation:', value: 'August 2027' },
  { label: 'Achievement:', value: 'Globe Innovania 2025 - Top 2' },
  { label: 'Current Role:', value: 'CEO, GDGOC DLSU' },
];

const About = () => (
  <section id="about" className="about">
    <div className="about__container">
      <div className="about__text">
        <h2 className="m3-display-small about__heading">About Me</h2>
        <p className="m3-body-large about__para">
          I'm a Computer Systems Engineering student at De La Salle University Manila, expected to
          graduate in August 2027. My academic journey combines software development fundamentals
          with deep computer systems knowledge — from web development and databases to computer
          architecture, operating systems, and microprocessor interfacing.
        </p>
        <p className="m3-body-large about__para">
          As Chief Executive Officer of Google Developer Group on Campus DLSU, I lead the development
          of internal tools and educational workshops. Previously as Chief Developer, I spearheaded
          projects that tripled membership from 120 to 360 members, including facial recognition
          systems, organizational portals, and AI-powered chatbots. I've also contributed to
          research — my OCR paper was accepted at the Philippine Computing Science Congress,
          completed in under 9 days.
        </p>
        <p className="m3-body-large about__para">
          What excites me most is building solutions that bridge theory and practice — whether it's
          developing full-stack hospital management systems, creating OS emulators in C++, or
          designing university-wide web platforms.
        </p>
      </div>

      <Card variant="elevated" className="about__facts-card">
        <div className="m3-card__content">
          <h3 className="m3-headline-small about__facts-heading">Quick Facts</h3>
          <dl className="about__facts-list">
            {quickFacts.map((fact) => (
              <div key={fact.label} className="about__fact">
                <dt className="m3-label-large about__fact-label">{fact.label}</dt>
                <dd className="m3-body-medium about__fact-value">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Card>
    </div>
  </section>
);

export default About;
