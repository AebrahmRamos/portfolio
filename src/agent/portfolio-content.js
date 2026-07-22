// Shared agent-facing data — used by worker.js (markdown/JSON endpoints)
// and main.jsx (WebMCP tool registration).

export const aboutData = {
  name: 'Aebrahm Ramos',
  alternateName: ['Aebrahm Clyde Ramos', 'Aebrahm Clyde P. Ramos'],
  title: 'Software Developer & CS Student',
  education: {
    degree: 'Bachelor of Science in Computer Science',
    major: 'Major in Computer Systems Engineering',
    institution: 'De La Salle University',
    period: 'Aug 2023 – Aug 2027',
    status: 'Current',
  },
  summary:
    'Aebrahm Clyde Ramos (Aebrahm Ramos) — CS student at De La Salle University specializing in full-stack web development, e-commerce inventory systems, and AI integration. Builds production internal tooling for a multi-store retail group, and leads Google Developer Group on Campus DLSU as CEO.',
  links: {
    email: 'eon.aebrahm@gmail.com',
    github: 'https://github.com/AebrahmRamos',
    linkedin: 'https://www.linkedin.com/in/aebrahmramos',
    resume: 'https://aebrahmramos.dev/resume/ramos-aebrahm-resume.pdf',
    portfolio: 'https://aebrahmramos.dev',
  },
};

export const experienceData = [
  {
    organization: 'Siwa Marketing Group',
    title: 'Full-Stack / Internal Tools Engineer',
    period: 'May 2025 – Present',
    type: 'Contract',
    highlights: [
      'Built the material-projection engine of an internal inventory system forecasting stock depletion and restock cadence from live order data',
      'Owned AI-assisted order quality-checking, automated spares allocation, and a Discord/WhatsApp order-lifecycle bot in a multi-store Laravel OMS',
      'Led a WCAG/axe accessibility overhaul and shipped AI storefront features across Shopify Liquid themes',
      'Built an internal Model Context Protocol (MCP) server exposing diagnostic tooling to AI agents',
    ],
  },
  {
    organization: 'Kiji Bakehouse / Superb Milestone Manufacturing Corp.',
    title: 'AI Operations Intern',
    period: 'Jan 2026 – Mar 2026',
    type: 'Internship',
    highlights: [
      'Co-engineered "Superb OS," a unified business management platform with real-time financial dashboards and ML-driven purchase order automation',
      'Built tri-agent automation pipeline for agentic refactoring using Claude Code',
      'Integrated drag-and-drop staff scheduling and remote branch music/queue management',
    ],
  },
  {
    organization: 'VISON Technologies Corporation',
    title: 'Research Apprentice',
    period: 'Dec 2024 – Jul 2025',
    type: 'Internship',
    highlights: [
      'OCR research paper accepted at Philippine Computing Science Congress (completed in under 9 days)',
      'Developed time-based, server-authenticated desktop access control system for TITAN computer vision software',
      'Configured Proxmox-based computational server for research office',
    ],
  },
];

export const projectsData = [
  {
    title: 'Inventory Forecasting & Materials Planning',
    description: 'Internal inventory system forecasting stock depletion and restock cadence from live order data for a multi-store e-commerce group.',
    technologies: ['Laravel', 'Inertia.js', 'React 19', 'Tailwind CSS v4', 'MySQL'],
  },
  {
    title: 'Multi-Store Order Management System',
    description: 'Laravel OMS centralizing Shopify orders across 4 stores and 2 regions, with automated spares allocation and an order-lifecycle bot.',
    technologies: ['Laravel 7', 'PHP', 'MySQL', 'Shopify Webhooks', 'GraphQL'],
  },
  {
    title: 'AI Order Quality-Check & Vision Grading',
    description: 'AI order quality-checking pipeline for a multi-store Shopify OMS, including a Gemini-native vision grading engine for automated spot-check review.',
    technologies: ['Laravel 7', 'PHP', 'Google Gemini', 'WhatsApp API', 'MySQL'],
  },
  {
    title: 'Multi-Channel POS Data Automation',
    description: 'Automated browser-based extraction of POS sales and inventory reports, with Gmail-API OTP handling.',
    technologies: ['Playwright', 'Gmail API', 'Google Gemini', 'Firebase'],
  },
  {
    title: 'Superb OS — Retail BI Dashboard',
    description: 'Real-time BI dashboard consolidating POS data for a multi-branch bakery, with an iOS delivery app.',
    technologies: ['React', 'Firebase', 'SwiftUI'],
  },
  {
    title: 'MCP Server — Diagnostic Tooling',
    description: 'Model Context Protocol server exposing internal diagnostic tools to AI agents.',
    technologies: ['Model Context Protocol', 'Node.js'],
  },
  {
    title: 'Operating System Emulator',
    description: 'Command-line OS simulator modeling process scheduling, virtual memory, and multi-core CPU allocation.',
    technologies: ['C++20', 'STL', 'pthreads', 'Expect', 'Makefile'],
  },
  {
    title: 'Nodado General Hospital Management System',
    description: 'Full-stack hospital management platform with patient records, pharmacy inventory, billing, and real-time WebSocket updates.',
    technologies: ['React', 'Node.js', 'Express', 'MySQL', 'Socket.IO', 'JWT'],
  },
  {
    title: 'University Student Government Website',
    description: 'Full-stack DLSU USG platform with RBAC, NextAuth.js, TOTP 2FA, rich-text CMS, and PM2/Nginx deployment.',
    technologies: ['Next.js 14', 'TypeScript', 'NextAuth.js', 'MySQL', 'Nginx'],
  },
  {
    title: 'GDGOC-DLSU Main Website',
    description: 'Organizational website with e-commerce, AI receipt analysis via Gemini, and member management.',
    technologies: ['Next.js 15', 'React 19', 'TypeScript', 'Firebase', 'Google Gemini AI'],
  },
  {
    title: 'GDGOC-DLSU Organizational Management Platform',
    description: 'Internal tools hub with member directory, order processing, and multi-departmental dashboards.',
    technologies: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'],
  },
  {
    title: 'La Salle Debate Society Official Website',
    description: 'Organizational website with member management, event galleries, and a learning resources portal.',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'DaisyUI'],
  },
  {
    title: 'GDGOC-DLSU Recruitment Website',
    description: 'Recruitment site that tripled membership from 120 to 360 members with dynamic content and onboarding.',
    technologies: ['React 18', 'Vite', 'Firebase', 'Material-UI'],
  },
  {
    title: 'RAG Chatbot',
    description: 'Retrieval-augmented chatbot using Vertex AI and Gemini to assist the university help desk.',
    technologies: ['Vertex AI', 'Gemini', 'JavaScript', 'Tailwind'],
  },
  {
    title: 'M68HC11 EPROM Programmer',
    description: 'Hardware programmer implementing the fast programming algorithm for a 2764 UVEPROM via Motorola M68HC11, including PCB fabrication.',
    technologies: ['M68HC11 Assembly', 'Python', 'PySerial'],
  },
  {
    title: 'RGB to Grayscale Converter',
    description: 'C + x86 Assembly image converter where the core conversion function is implemented in Assembly.',
    technologies: ['x86 Assembly', 'C', 'NASM'],
  },
];

export const contactData = {
  email: 'eon.aebrahm@gmail.com',
  github: 'https://github.com/AebrahmRamos',
  linkedin: 'https://www.linkedin.com/in/aebrahmramos',
  resume: 'https://aebrahmramos.dev/resume/ramos-aebrahm-resume.pdf',
  portfolio: 'https://aebrahmramos.dev',
};

export const portfolioMarkdown = `# Aebrahm Ramos (Aebrahm Clyde Ramos) — Portfolio

CS student at De La Salle University (BS Computer Science, Major in Computer Systems Engineering, Aug 2023–2027). Software engineer specializing in full-stack web development, e-commerce inventory systems, and AI integration.

## Experience

### Full-Stack / Internal Tools Engineer — Siwa Marketing Group
*May 2025 – Present*

- Built the material-projection engine of an internal inventory system forecasting stock depletion and restock cadence from live order data
- Owned AI-assisted order quality-checking, automated spares allocation, and a Discord/WhatsApp order-lifecycle bot in a multi-store Laravel OMS
- Led a WCAG/axe accessibility overhaul and shipped AI storefront features across Shopify Liquid themes
- Built an internal Model Context Protocol (MCP) server exposing diagnostic tooling to AI agents

### AI Operations Intern — Kiji Bakehouse / Superb Milestone Manufacturing Corp.
*Jan 2026 – Mar 2026*

- Co-engineered "Superb OS," a unified business management platform with real-time financial dashboards and an ML-driven purchase order system trained on 3 years of transaction data
- Built a tri-agent automation pipeline using Claude Code for agentic refactoring
- Integrated drag-and-drop staff scheduling and remote branch music/queue management

### Research Apprentice — VISON Technologies Corporation
*Dec 2024 – Jul 2025*

- OCR research paper accepted at Philippine Computing Science Congress (completed in 9 days)
- Developed time-based, server-authenticated desktop access control system for TITAN computer vision software
- Configured Proxmox-based computational server for research office

## Projects

| Project | Stack |
|---------|-------|
| Inventory Forecasting & Materials Planning | Laravel, Inertia.js, React 19, MySQL |
| Multi-Store Order Management System | Laravel 7, PHP, MySQL, Shopify Webhooks |
| AI Order Quality-Check & Vision Grading | Laravel 7, PHP, Google Gemini, WhatsApp API |
| Multi-Channel POS Data Automation | Playwright, Gmail API, Gemini, Firebase |
| Superb OS — Retail BI Dashboard | React, Firebase, SwiftUI |
| MCP Server — Diagnostic Tooling | Model Context Protocol, Node.js |
| Operating System Emulator | C++20, STL, pthreads |
| Nodado General Hospital Management System | React, Node.js, MySQL, Socket.IO |
| University Student Government Website | Next.js 14, TypeScript, NextAuth.js |
| GDGOC-DLSU Main Website | Next.js 15, Firebase, Gemini AI |
| GDGOC-DLSU Organizational Management Platform | Next.js, TypeScript, Firebase |
| La Salle Debate Society Website | Next.js 15, TypeScript, DaisyUI |
| GDGOC-DLSU Recruitment Website | React 18, Vite, Firebase |
| RAG Chatbot | Vertex AI, Gemini, JavaScript |
| M68HC11 EPROM Programmer | M68HC11 Assembly, Python, PySerial |
| RGB to Grayscale Converter | x86 Assembly, C, NASM |

## Skills

- **Frontend:** React, Next.js, TypeScript, JavaScript, HTML/CSS, Tailwind CSS, Inertia.js, Radix UI, SwiftUI
- **Backend:** Node.js, Express.js, Laravel, PHP, Python, Java, C/C++, x86 Assembly
- **Database:** MongoDB, MySQL, Firebase, Supabase
- **Tools:** GitHub, Docker, GCP, Azure, Cloudflare Workers, Shopify (Liquid), OpenAI, Model Context Protocol, Playwright

## Education

**De La Salle University** — BS Computer Science, Major in Computer Systems Engineering (Aug 2023–2027, Current)

Relevant coursework: Data Structures & Algorithms, Operating Systems, Software Engineering, Computer Architecture, Digital Signal Processing, Embedded Hardware Design, Parallel Computing

## Contact

- Email: eon.aebrahm@gmail.com
- GitHub: https://github.com/AebrahmRamos
- LinkedIn: https://www.linkedin.com/in/aebrahmramos
- Resume: https://aebrahmramos.dev/resume/ramos-aebrahm-resume.pdf
`;
