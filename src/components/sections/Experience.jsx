import React from 'react';
import { experience } from '../../data/experience';
import './Experience.css';

// The timeline is the one signature layout on this page and it stays. What
// changed: it is no longer also used by Organizations (that was the same
// layout family twice), the entries are hairline-ruled instead of elevated
// cards, and the "Open to Opportunities" chip block at the end is gone. The
// hero already states availability once, in the place a recruiter reads first.
const Experience = () => (
  <section id="experience" className="experience">
    <div className="section__container">
      <div className="section__header">
        <h2 className="m3-display-small section__title">Experience</h2>
        <hr className="section__rule" />
      </div>

      <ol className="timeline">
        {experience.map((org) => (
          <li key={org.id} className="timeline__entry">
            <span className="timeline__node" aria-hidden="true" />

            <div className="timeline__body">
              <h3 className="m3-headline-small timeline__org">{org.organization}</h3>

              {org.positions.map((pos) => (
                <div key={pos.id} className="timeline__position">
                  <div className="timeline__position-header">
                    <p className="m3-title-medium timeline__role">
                      {pos.title}
                      {pos.current && <span className="timeline__now">Now</span>}
                    </p>
                    <p className="m3-label-medium timeline__meta">
                      {pos.type}
                      <span className="timeline__meta-sep" aria-hidden="true" />
                      {pos.date}
                    </p>
                  </div>

                  <p className="m3-body-medium timeline__desc">{pos.description}</p>

                  {pos.responsibilities?.length > 0 && (
                    <ul className="timeline__points">
                      {pos.responsibilities.map((r) => (
                        <li key={r} className="m3-body-medium">{r}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Experience;
