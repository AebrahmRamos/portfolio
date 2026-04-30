import React from 'react';
import { FiMonitor, FiCode, FiDatabase, FiTool } from 'react-icons/fi';
import { Card, Chip } from '../m3';
import { skills, mernStack } from '../../data/skills';
import './Skills.css';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'Web': return <FiMonitor size={28} />;
    case 'Code': return <FiCode size={28} />;
    case 'Storage': return <FiDatabase size={28} />;
    case 'Tools': return <FiTool size={28} />;
    default: return <FiCode size={28} />;
  }
};

const skillCategories = [
  { key: 'frontend', data: skills.frontend },
  { key: 'backend', data: skills.backend },
  { key: 'database', data: skills.database },
  { key: 'tools', data: skills.tools },
];

const Skills = () => (
  <section id="skills" className="skills">
    <div className="section__container">
      <div className="section__header">
        <h2 className="m3-display-small section__title">Skills & Technologies</h2>
        <p className="m3-body-large section__subtitle">
          Technical expertise across the full-stack development spectrum
        </p>
      </div>

      <div className="skills__grid">
        {skillCategories.map(({ key, data }) => (
          <Card key={key} variant="elevated" className="skills__card">
            <div className="m3-card__content skills__card-content">
              <div className="skills__icon" style={{ backgroundColor: data.color }}>
                {getIcon(data.icon)}
              </div>
              <p className="m3-title-medium skills__category">{data.title}</p>
              <ul className="skills__list">
                {data.skills.map((skill, i) => (
                  <li key={i} className="skills__item">
                    <span className="m3-body-medium skills__item-text">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <div className="skills__mern">
        <p className="m3-title-large skills__mern-title">MERN Stack Proficiency</p>
        <div className="skills__mern-chips">
          {mernStack.map((tech) => (
            <Chip
              key={tech.id}
              label={tech.name}
              variant="filter"
              selected
              className="skills__mern-chip"
            />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Skills;
