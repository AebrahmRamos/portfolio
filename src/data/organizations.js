/**
 * Student organizations and extracurricular involvement
 */

export const organizations = [
  {
    id: 1,
    organization: 'Google Developer Group on Campus DLSU',
    positions: [
      {
        id: '1-1',
        title: 'Chief Executive Officer',
        date: 'Sep 2025 - Aug 2026',
        type: 'Leadership',
        description:
          'Spearheading the development of internal tools and systems designed to enhance organizational productivity and efficiency.',
        responsibilities: [
          'Spearheaded the development of internal tools and systems designed to enhance organizational productivity and efficiency',
          'Currently implementing and processing workshops to upskill officers on Google products',
        ],
        current: true,
      },
      {
        id: '1-2',
        title: 'Chief Developer (Executive)',
        date: 'Oct 2024 - Aug 2025',
        type: 'Leadership',
        description:
          'Led the development of internal tools, recruitment systems, and organizational partnerships while tripling membership from 120 to 360 members.',
        responsibilities: [
          'Created a dedicated recruitment website that streamlined the application process, tripling membership from 120 to 360 members',
          'Collaborated with partner student organizations to develop and implement their websites',
          'Initiated partnership with USG and Computer Studies Government to develop web-based solutions',
          'Led development of ESP-32 facial recognition attendance system, organizational portal, and RAG chatbot for student services',
        ],
        current: false,
      },
      {
        id: '1-3',
        title: 'Logistics Officer and Equipment Handler',
        date: 'Oct 2024 - Present',
        type: 'Leadership',
        description:
          'Managing event logistics, resource allocation, and technical support for organizational activities.',
        responsibilities: [
          'Utilized Google Suites applications to track timelines, tasks, and allocate resources effectively',
          'Successfully helped implement events both in and outside the university',
          'Collaborated closely with partnership coordinators and team members for logistical needs',
          'Effectively troubleshoots technical difficulties before and during events',
        ],
        current: true,
      },
    ],
    iconColor: 'primary',
  },
  {
    id: 2,
    organization: 'University Student Government, DLSU',
    positions: [
      {
        id: '2-1',
        title: 'Executive Director for Web Development',
        date: 'Dec 2024 - Jul 2025',
        type: 'Leadership',
        description:
          'Spearheaded development and maintenance of USG website focusing on user experience and accessibility.',
        responsibilities: [
          'Led development and maintenance of University Student Government website',
          'Focused on user experience and accessibility while providing necessary tools for students',
        ],
        current: false,
      },
    ],
    iconColor: 'primary',
  },
  {
    id: 3,
    organization: 'DLSU Microsoft Student Community',
    positions: [
      {
        id: '3-1',
        title: 'Research and Development Officer',
        date: 'Oct 2024 - Jul 2025',
        type: 'Leadership',
        description:
          'Contributing to research initiatives and technical development projects within the Microsoft Student Community.',
        responsibilities: [
          'Participated in research and development initiatives',
          'Contributed to technical projects and workshops',
        ],
        current: false,
      },
    ],
    iconColor: 'info',
  },
  {
    id: 4,
    organization: 'DLSU Applied Computing and Machinery (ACM)',
    positions: [
      {
        id: '4-1',
        title: 'Activities Officer',
        date: 'Oct 2024 - Jul 2025',
        type: 'Leadership',
        description:
          'Improved usability and management of booth attendance tracker for annual college-wide events.',
        responsibilities: [
          'Improved usability and management of booth attendance tracker for annual college-wide event',
        ],
        current: false,
      },
    ],
    iconColor: 'success',
  },
];

export default organizations;
