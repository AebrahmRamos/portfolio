/**
 * Skills and technologies data for portfolio
 * Organized by categories: Frontend, Backend, Database, and Tools
 * Also includes MERN stack proficiency data
 */

export const skills = {
  frontend: {
    title: 'Frontend Development',
    icon: 'Web', // Icon identifier
    color: '#377dff', // Blue
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'HTML/CSS',
      'Material-UI',
      'Tailwind CSS',
      'DaisyUI',
    ],
  },
  backend: {
    title: 'Backend Development',
    icon: 'Code',
    color: '#f9b934', // Yellow
    skills: [
      'Node.js',
      'Express.js',
      'Python',
      'Java',
      'C/C++',
      'x86 Assembly',
    ],
  },
  database: {
    title: 'Database & Storage',
    icon: 'Storage',
    color: '#2e7d32', // Green
    skills: [
      'MongoDB',
      'MySQL',
      'Firebase',
      'Supabase',
      'SQLite',
    ],
  },
  tools: {
    title: 'Tools & Platforms',
    icon: 'Tools',
    color: '#ed6c02', // Orange
    skills: [
      'GitHub',
      'Docker',
      'GCP',
      'Azure',
      'DigitalOcean',
      'PayloadCMS',
    ],
  },
};

// MERN Stack proficiency badges
export const mernStack = [
  {
    id: 1,
    name: 'MongoDB',
    color: '#47A248',
  },
  {
    id: 2,
    name: 'Express.js',
    color: '#000000',
  },
  {
    id: 3,
    name: 'React',
    color: '#61DAFB',
  },
  {
    id: 4,
    name: 'Node.js',
    color: '#339933',
  },
];

export default skills;
