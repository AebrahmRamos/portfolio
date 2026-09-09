import React from 'react';
import { organizations } from '../../data/organizations';
import './Organizations.css';

// Flattened to role rows. This section used to render the exact same timeline
// component as Experience, which put the page's most recognisable layout on
// screen twice in a row and gave a student-society activities role the same
// weight as a paid engineering contract.
const roles = organizations.flatMap((org) =>
  org.positions.map((pos) => ({
    id: pos.id,
    org: org.organization,
    title: pos.title,
    date: pos.date,
    current: pos.current,
  }))
);

const Organizations = () => (
  <section id="organizations" className="organizations">
    <div className="section__container">
      <div className="section__header">
        <h2 className="m3-display-small section__title">Organizations</h2>
        <hr className="section__rule" />
      </div>

      <ul className="orgs">
        {roles.map((role) => (
          <li key={role.id} className="orgs__row">
            <span className="m3-title-small orgs__role">
              {role.title}
              {role.current && <span className="orgs__now">Now</span>}
            </span>
            <span className="m3-body-medium orgs__org">{role.org}</span>
            <span className="m3-label-medium orgs__date">{role.date}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Organizations;
