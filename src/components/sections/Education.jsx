import React from 'react';
import { FiBookOpen } from 'react-icons/fi';
import { Card, Chip, Avatar } from '../m3';
import { education } from '../../data/education';
import './Education.css';

const Education = () => (
  <section id="education" className="education">
    <div className="section__container">
      <div className="section__header">
        <h2 className="m3-display-small section__title">Education</h2>
        <p className="m3-body-large section__subtitle">
          My academic journey in computer science and engineering
        </p>
      </div>

      <div className="education__grid">
        {education.map((edu) => (
          <Card
            key={edu.id}
            variant={edu.current ? 'outlined' : 'elevated'}
            className={`education__card ${edu.current ? 'education__card--current' : ''}`}
          >
            <div className="m3-card__content">
              <div className="education__card-header">
                <Avatar
                  size={42}
                  color={edu.current ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-secondary)'}
                >
                  <FiBookOpen size={20} color="white" />
                </Avatar>
                <div>
                  <p className="m3-title-medium education__degree">{edu.degree}</p>
                  {edu.major && (
                    <p className="m3-body-small education__major">{edu.major}</p>
                  )}
                </div>
              </div>

              <p className="m3-label-large education__institution">{edu.institution}</p>
              {edu.date && <p className="m3-body-small education__date">{edu.date}</p>}

              {edu.status && (
                <div className="education__status">
                  <Chip
                    label={edu.status}
                    variant={edu.statusColor === 'primary' ? 'filter' : 'assist'}
                    selected={edu.statusColor === 'primary'}
                  />
                </div>
              )}

              {edu.activities && (
                <div className="education__section">
                  <p className="m3-label-large">Activities:</p>
                  <p className="m3-body-small education__muted">{edu.activities}</p>
                </div>
              )}

              {edu.skills && (
                <div className="education__section">
                  <p className="m3-label-large">Skills:</p>
                  <div className="education__chips">
                    {edu.skills.map((skill, i) => (
                      <Chip key={i} label={skill} variant="assist" />
                    ))}
                    {edu.additionalSkills > 0 && (
                      <Chip label={`+${edu.additionalSkills} more`} variant="assist" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default Education;
