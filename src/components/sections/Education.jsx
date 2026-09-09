import React from 'react';
import { education } from '../../data/education';
import './Education.css';

// One entry now, so the timeline scaffolding is gone: a rail, nodes and cards
// for a single row was structure with nothing to structure. The two
// secondary-school entries were dropped, they carried no signal for a
// freelance client or a hiring manager.
const Education = () => {
  const [degree] = education;
  if (!degree) return null;

  return (
    <section id="education" className="education">
      <div className="section__container">
        <div className="section__header">
          <h2 className="m3-display-small section__title">Education</h2>
          <hr className="section__rule" />
        </div>

        <div className="education__panel">
          <div className="education__head">
            <div>
              <h3 className="m3-headline-small education__degree">{degree.degree}</h3>
              {degree.major && (
                <p className="m3-body-medium education__major">{degree.major}</p>
              )}
              <p className="m3-title-small education__school">{degree.institution}</p>
            </div>
            {degree.date && (
              <p className="m3-label-medium education__date">{degree.date}</p>
            )}
          </div>

          {degree.tracks && (
            <dl className="education__tracks">
              {degree.tracks.map((track) => (
                <div key={track.label} className="education__track">
                  <dt className="m3-label-medium education__track-label">{track.label}</dt>
                  <dd className="education__track-courses">
                    {track.courses.map((course) => (
                      <span key={course} className="education__course">{course}</span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </section>
  );
};

export default Education;
