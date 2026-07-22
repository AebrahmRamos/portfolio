import { FiCode, FiUsers, FiBookOpen } from 'react-icons/fi';
import { Card, Chip } from '../m3';
import { organizations } from '../../data/organizations';
import './Organizations.css';

const getIcon = (orgName) => {
  if (orgName.includes('Google') || orgName.includes('ACM')) return <FiCode size={20} />;
  if (orgName.includes('USG') || orgName.includes('Student Government')) return <FiUsers size={20} />;
  return <FiBookOpen size={20} />;
};

const Organizations = () => (
  <section id="organizations" className="organizations">
    <div className="section__container">
      <div className="section__header">
        <h2 className="m3-display-small section__title organizations__title">
          Student Organizations
        </h2>
        <p className="m3-body-large section__subtitle">
          Leadership roles and contributions to university organizations
        </p>
      </div>

      <div className="timeline">
        <div className="timeline__line" aria-hidden="true" />

        {organizations.map((org) => (
          <div key={org.id} className="timeline__entry">
            <div className="timeline__node" aria-hidden="true">
              {getIcon(org.organization)}
            </div>

            <Card variant="elevated" interactive className="timeline__card">
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
    </div>
  </section>
);

export default Organizations;
