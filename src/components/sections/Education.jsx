import { FiBookOpen } from 'react-icons/fi';
import { Card, Chip } from '../m3';
import { education } from '../../data/education';
import './Education.css';

const Education = () => (
  <section id="education" className="education">
    <div className="section__container">
      <div className="section__header">
        <h2 className="m3-display-small section__title education__title">Education</h2>
        <p className="m3-body-large section__subtitle">
          Academic background in computer science and engineering
        </p>
      </div>

      <div className="edu-timeline">
        <div className="edu-timeline__line" aria-hidden="true" />

        {education.map((edu) => (
          <div key={edu.id} className="edu-timeline__entry">
            <div
              className={`edu-timeline__node ${edu.current ? 'edu-timeline__node--current' : ''}`}
              aria-hidden="true"
            >
              <FiBookOpen size={edu.current ? 20 : 16} />
            </div>

            <Card
              variant={edu.current ? 'outlined' : 'elevated'}
              className={`edu-timeline__card ${edu.current ? 'edu-timeline__card--current' : ''}`}
            >
              <div className="m3-card__content">
                <div className="edu-timeline__header">
                  <div className="edu-timeline__meta">
                    <p className="m3-title-medium edu-timeline__degree">{edu.degree}</p>
                    {edu.current && <Chip label="Current" variant="filter" selected />}
                  </div>
                  {edu.date && (
                    <span className="m3-body-small edu-timeline__date">{edu.date}</span>
                  )}
                </div>

                {edu.major && (
                  <p className="m3-body-medium edu-timeline__major">{edu.major}</p>
                )}

                <p className="m3-label-large edu-timeline__institution">{edu.institution}</p>

                {edu.tracks && (
                  <div className="edu-timeline__tracks">
                    {edu.tracks.map((track) => (
                      <div key={track.label} className="edu-timeline__track">
                        <p className="m3-label-medium edu-timeline__track-label">{track.label}</p>
                        <div className="edu-timeline__track-chips">
                          {track.courses.map((course) => (
                            <Chip key={course} label={course} variant="assist" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Education;
