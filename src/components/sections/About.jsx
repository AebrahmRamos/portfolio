import React from 'react';
import './About.css';

// Facts render as a plain definition list with hairline rows. They used to be
// five tonal pill boxes nested inside an elevated card inside a section, three
// levels of container for five key/value pairs.
const quickFacts = [
  { label: 'University', value: 'DLSU Manila' },
  { label: 'Program', value: 'BS Computer Science, Computer Systems Engineering' },
  { label: 'Graduating', value: 'August 2027' },
  { label: 'Recognition', value: 'Globe Innovania 2025, Top 2' },
  { label: 'Current role', value: 'CEO, GDGOC DLSU' },
];

const About = () => (
  <section id="about" className="about">
    <div className="section__container about__container">
      <div className="about__text">
        <h2 className="m3-display-small section__title">About</h2>
        <hr className="section__rule" />

        <p className="m3-body-large about__para">
          I am Aebrahm Clyde Ramos, most often just Aebrahm Ramos. I study Computer
          Systems Engineering at De La Salle University Manila and graduate in August
          2027. The degree pairs software fundamentals with the layer underneath them:
          computer architecture, operating systems, and microprocessor interfacing.
        </p>
        <p className="m3-body-large about__para">
          Since May 2025 I have been building production software for a multi-store
          e-commerce group. That work includes an inventory-forecasting engine that
          predicts stock depletion from live order data, an order management system
          with AI-assisted quality checks, and an internal MCP server that exposes
          diagnostics to AI agents.
        </p>
        <p className="m3-body-large about__para">
          I also lead Google Developer Group on Campus DLSU as Chief Executive Officer.
          As Chief Developer before that, I shipped the recruitment platform that took
          membership from 120 to 360. My OCR research paper was accepted at the
          Philippine Computing Science Congress, written in under nine days.
        </p>
      </div>

      <dl className="about__facts">
        {quickFacts.map((fact) => (
          <div key={fact.label} className="about__fact">
            <dt className="m3-label-medium about__fact-label">{fact.label}</dt>
            <dd className="m3-body-medium about__fact-value">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

export default About;
