import {
  portfolioMarkdown,
  aboutData,
  experienceData,
  projectsData,
  contactData,
} from './agent/portfolio-content.js';

const LINK_HEADER = [
  '</.well-known/agent-skills/index.json>; rel="service-desc"',
  '</.well-known/mcp/server-card.json>; rel="service-doc"',
].join(', ');

const MCP_SERVER_CARD = {
  schemaVersion: '1.0',
  serverInfo: {
    name: 'aebrahmramos-portfolio',
    version: '1.0.0',
    description: 'Portfolio of Aebrahm Ramos — CS student and developer at DLSU',
  },
  transport: { type: 'webmcp' },
  capabilities: {
    tools: ['get_about', 'get_projects', 'get_experience', 'get_contact'],
  },
  url: 'https://aebrahmramos.dev',
};

const AGENT_SKILLS_INDEX = {
  $schema: 'https://agentskills.io/schema/v0.2.0/index.json',
  skills: [
    {
      name: 'get_about',
      type: 'webmcp',
      description: 'Get biography, education, and summary for Aebrahm Ramos',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_projects',
      type: 'webmcp',
      description: 'Get all portfolio projects with descriptions and tech stacks',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_experience',
      type: 'webmcp',
      description: 'Get professional work experience and internships',
      url: 'https://aebrahmramos.dev',
    },
    {
      name: 'get_contact',
      type: 'webmcp',
      description: 'Get contact information including email, GitHub, LinkedIn, and resume',
      url: 'https://aebrahmramos.dev',
    },
  ],
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}

function injectLinkHeader(response) {
  const headers = new Headers(response.headers);
  headers.set('Link', LINK_HEADER);
  headers.set('Vary', 'Accept');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // .well-known endpoints
    if (pathname === '/.well-known/mcp/server-card.json') {
      return jsonResponse(MCP_SERVER_CARD);
    }

    if (pathname === '/.well-known/agent-skills/index.json' || pathname === '/.well-known/agent-skills/') {
      return jsonResponse(AGENT_SKILLS_INDEX);
    }

    // Markdown content negotiation — any HTML route
    const accept = request.headers.get('Accept') ?? '';
    if (accept.includes('text/markdown')) {
      return new Response(portfolioMarkdown, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, max-age=3600',
          'Vary': 'Accept',
          Link: LINK_HEADER,
        },
      });
    }

    // Static assets — inject Link header on HTML responses
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get('Content-Type') ?? '';
    if (contentType.includes('text/html')) {
      return injectLinkHeader(response);
    }
    return response;
  },
};
