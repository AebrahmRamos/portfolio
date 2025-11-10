/**
 * Professional work experience data for portfolio
 * Contains work history and internships (no student organizations)
 */

export const experience = [
  {
    id: 1,
    organization: 'VISON Technologies Corporation',
    positions: [
      {
        id: '1-1',
        title: 'Research Apprentice',
        date: 'Dec 2024 - Jul 2025',
        type: 'Internship',
        description:
          'Conducted advanced research in OCR systems and developed time-based authentication systems for business implementation.',
        responsibilities: [
          'Research paper on OCR accepted for Philippine Computing Science Congress (completed in under 9 days)',
          'Solely developed Time-Based, Server-Authenticated Desktop Access Control System for TITAN computer vision software',
          'Collaborated on setting up and configuring Proxmox-based computational server for research office members',
        ],
        current: false,
      },
    ],
    iconColor: 'primary',
  },
  {
    id: 2,
    organization: 'Outdoor Retail Company, USA',
    positions: [
      {
        id: '2-1',
        title: 'Remote Freelance Frontend Developer',
        date: 'Oct 2024 - Mar 2025',
        type: 'Freelance',
        description:
          'Developed reusable Shopify components and redesigned pages for mobile responsiveness.',
        responsibilities: [
          'Developed library of reusable Shopify components using Liquid, HTML, and CSS',
          'Redesigned e-commerce storefront pages to be fully mobile-responsive',
        ],
        current: false,
      },
    ],
    iconColor: 'secondary',
  },
];

// Opportunity availability status
export const opportunities = [
  {
    id: 1,
    title: 'Available for Internships',
    color: 'primary', // Blue
  },
  {
    id: 2,
    title: 'Open to Part-time Work',
    color: 'secondary', // Yellow
  },
  {
    id: 3,
    title: 'Research Opportunities',
    color: 'success', // Green
  },
];

export default experience;
