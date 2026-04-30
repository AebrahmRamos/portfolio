import { FiBriefcase, FiAward } from 'react-icons/fi';
import { Card, Chip } from '../m3';
import { experience, opportunities } from '../../data/experience';
import './Experience.css';

const getIcon = (type) =>
  type === 'Internship' ? <FiAward size={20} /> : <FiBriefcase size={20} />;

const Experience = () => (
  <section id="experience" className="experience">
    <div className="section__container">
      <div className="section__header">
        <h2 className="m3-display-small section__title experience__title">
          Professional Experience
        </h2>
        <p className="m3-body-large section__subtitle">
          Work history and internships in software development
        </p>
      </div>

      <div className="timeline">
        <div className="timeline__line" aria-hidden="true" />

        {experience.map((org) => (
          <div key={org.id} className="timeline__entry">
            <div
              className={`timeline__node ${org.iconColor === 'secondary' ? 'timeline__node--secondary' : ''}`}
              aria-hidden="true"
            >
              {getIcon(org.positions[0].type)}
            </div>

            <Card variant="elevated" className="timeline__card">
              <div className="m3-card__content">
                <p className="m3-title-large timeline__org">{org.organization}</p>

                {org.positions.map((pos, posIdx) => (
                  <div
                    key={pos.id}
                    className={`timeline__position ${posIdx < org.positions.length - 1 ? 'timeline__position--divider' : ''}`}
                  >
                    <div className="timeline__position-header">
                      <div className="timeline__position-meta">
                        <span className="m3-title-medium">{pos.title}</span>
                        {pos.current && <Chip label="Current" variant="filter" selected />}
                        <Chip label={pos.type} variant="assist" />
                      </div>
                      <span className="m3-body-small timeline__date">{pos.date}</span>
                    </div>

                    <p className="m3-body-medium timeline__desc">{pos.description}</p>

                    {pos.responsibilities?.length > 0 && (
                      <ul className="timeline__resps">
                        {pos.responsibilities.map((r, i) => (
                          <li key={i} className="m3-body-small">{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </div>

      {opportunities?.length > 0 && (
        <div className="experience__opportunities">
          <p className="m3-title-medium experience__opp-title">Open to Opportunities</p>
          <div className="experience__opp-chips">
            {opportunities.map((opp) => (
              <Chip key={opp.id} label={opp.title} variant="filter" selected />
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);

export default Experience;
