import React from 'react';
import { skills } from '../../data/skills';
import './Skills.css';

// Four elevated cards holding 35 full-width tonal pills, plus a "MERN Stack
// Proficiency" slab, was the densest block on the page for the least
// information. Skills are a scan-list: grouped label, then the names.
const Skills = () => (
  <section id="skills" className="skills">
    <div className="section__container">
      <div className="section__header">
        <h2 className="m3-display-small section__title">Skills</h2>
        <hr className="section__rule" />
      </div>

      <dl className="skills__groups">
        {skills.map((group) => (
          <div key={group.key} className="skills__group">
            <dt className="m3-title-medium skills__group-title">{group.title}</dt>
            <dd className="skills__group-items">
              {group.items.map((item) => (
                <span key={item} className="skills__item">{item}</span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  </section>
);

export default Skills;
