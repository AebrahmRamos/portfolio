/**
 * Professional work experience data for portfolio
 * Contains work history and internships (no student organizations)
 */

export const experience = [
  {
    id: 1,
    organization: 'Kiji Bakehouse / Superb Milestone Manufacturing Corp.',
    positions: [
      {
        id: '1-1',
        title: 'AI Operations Intern',
        date: 'Jan 2026 - Mar 2026',
        type: 'Internship',
        description:
          'Co-engineered "Superb OS," a unified business management platform with real-time financial dashboards, ML-driven purchase order automation, and multi-branch operations management.',
        responsibilities: [
          'Co-engineered "Superb OS" featuring a real-time financial dashboard for multi-branch sales tracking and an automated purchase order system driven by a hybrid ML predictive model trained on three years of historical transaction data',
          'Accelerated development using Claude Code and a custom tri-agent automation pipeline for agentic refactoring and rapid boilerplate generation',
          'Integrated a drag-and-drop heuristic-based staff scheduling system with on-the-fly rule validation and a centralized remote application for branch music playback and queue management',
        ],
        current: false,
      },
    ],
    iconColor: 'tertiary',
  },
  {
    id: 2,
    organization: 'VISON Technologies Corporation',
    positions: [
      {
        id: '2-1',
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
