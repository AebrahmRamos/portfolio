import React, { useState } from 'react';
import { FiDownload, FiExternalLink, FiFileText, FiX } from 'react-icons/fi';
import { Button, IconButton, Dialog } from '../m3';
import './Resume.css';

const resumeFeatures = [
  'Education & Academic Background',
  'Technical Skills & Expertise',
  'Project Portfolio',
  'Professional Experience',
  'Research Experience',
  'Contact Information',
];

const Resume = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="resume" className="resume">
      <div className="resume__container">
        <FiFileText size={56} className="resume__icon" />

        <h2 className="m3-display-small resume__title">Download My Resume</h2>
        <p className="m3-headline-small resume__subtitle">
          Get a comprehensive overview of my education, experience, and skills
        </p>

        <div className="resume__ctas">
          <Button
            variant="elevated"
            size="large"
            startIcon={<FiDownload />}
            href="/resume/ramos-aebrahm-resume.pdf"
            download
            className="resume__btn-download"
          >
            Download PDF Resume
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<FiExternalLink />}
            onClick={() => setModalOpen(true)}
            className="resume__btn-view"
          >
            View Online
          </Button>
        </div>

        <div className="resume__features">
          <p className="m3-title-medium resume__features-title">What's Inside</p>
          <ul className="resume__features-list">
            {resumeFeatures.map((f) => (
              <li key={f} className="resume__feature-item">
                <span className="resume__feature-dot" aria-hidden="true" />
                <span className="m3-body-large resume__feature-text">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="m3-body-small resume__updated">
          Last updated: April 30, 2026 • Available in PDF format
        </p>
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} ariaLabel="Resume viewer">
        <div className="m3-dialog__header resume__modal-header">
          <h2 className="m3-title-large">Resume — Aebrahm Ramos</h2>
          <IconButton onClick={() => setModalOpen(false)} aria-label="Close resume viewer">
            <FiX size={20} />
          </IconButton>
        </div>
        <div className="resume__modal-body">
          <object
            data="/resume/ramos-aebrahm-resume.pdf#toolbar=1&navpanes=0&scrollbar=1"
            type="application/pdf"
            className="resume__pdf"
          >
            <div className="resume__pdf-fallback">
              <p className="m3-body-large">Your browser doesn't support embedded PDFs.</p>
              <Button variant="filled" href="/resume/ramos-aebrahm-resume.pdf" download startIcon={<FiDownload />}>
                Download PDF Instead
              </Button>
            </div>
          </object>
        </div>
      </Dialog>
    </section>
  );
};

export default Resume;
