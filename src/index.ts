interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Papers With Code MCP — browse ML research papers and their code repositories
 *
 * Tools:
 * - search_papers: Search research papers by keyword
 * - get_paper: Get a single paper by ID
 * - get_repositories: Get code repositories linked to a paper
 * - trending_papers: Get trending papers ordered by proceedings
 */


const BASE_URL = 'https://paperswithcode.com/api/v1';

// --- Raw API types ---

type RawPaper = {
  id: string;
  arxiv_id?: string | null;
  url_abs?: string | null;
  url_pdf?: string | null;
  title?: string | null;
  abstract?: string | null;
  authors?: string[] | null;
  published?: string | null;
  conference?: string | null;
  conference_url_abs?: string | null;
  proceeding?: string | null;
};

type RawRepository = {
  id?: number | null;
  url?: string | null;
  owner?: string | null;
  name?: string | null;
  description?: string | null;
  stars?: number | null;
  framework?: string | null;
  is_official?: boolean | null;
};

type PaperListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawPaper[];
};

type RepositoryListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawRepository[];
};

// --- Formatters ---

function formatPaper(paper: RawPaper) {
  return {
    id: paper.id,
    arxiv_id: paper.arxiv_id ?? null,
    title: paper.title ?? null,
    abstract: paper.abstract ?? null,
    authors: paper.authors ?? [],
    published: paper.published ?? null,
    conference: paper.conference ?? null,
    proceeding: paper.proceeding ?? null,
    url_abs: paper.url_abs ?? null,
    url_pdf: paper.url_pdf ?? null,
  };
}

function formatRepository(repo: RawRepository) {
  return {
    id: repo.id ?? null,
    url: repo.url ?? null,
    owner: repo.owner ?? null,
    name: repo.name ?? null,
    description: repo.description ?? null,
    stars: repo.stars ?? null,
    framework: repo.framework ?? null,
    is_official: repo.is_official ?? null,
  };
}

// --- Tool definitions ---

const tools: McpToolExport['tools'] = [
  {
    name: 'search_papers',
    description:
      'Search ML research papers on Papers With Code by keyword. Returns title, authors, abstract, conference, and links.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (e.g., "attention transformer")' },
        limit: { type: 'number', description: 'Number of results to return (default: 10, max: 50)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_paper',
    description:
      'Get a single paper by its Papers With Code ID. Returns full metadata including title, abstract, authors, and links.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Papers With Code paper ID (e.g., "attention-is-all-you-need")' },
      },
      required: ['id'],
    },
  },
  {
    name: 'get_repositories',
    description:
      'Get code repositories linked to a paper by paper ID. Returns repo URL, stars, framework, and whether it is the official implementation.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Papers With Code paper ID' },
      },
      required: ['id'],
    },
  },
  {
    name: 'trending_papers',
    description:
      'Get trending ML research papers ordered by conference proceedings. Returns title, authors, conference, and links.',
    inputSchema: {
      type: 'object',
      properties: {
        limit: { type: 'number', description: 'Number of results to return (default: 10, max: 50)' },
      },
    },
  },
];

// --- callTool dispatcher ---

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_papers':
      return searchPapers(args.query as string, (args.limit as number) ?? 10);
    case 'get_paper':
      return getPaper(args.id as string);
    case 'get_repositories':
      return getRepositories(args.id as string);
    case 'trending_papers':
      return trendingPapers((args.limit as number) ?? 10);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// --- Tool implementations ---

async function searchPapers(query: string, limit: number) {
  const itemsPerPage = Math.min(Math.max(1, limit), 50);
  const params = new URLSearchParams({
    q: query,
    page: '1',
    items_per_page: String(itemsPerPage),
  });

  const res = await fetch(`${BASE_URL}/papers/?${params}`);
  if (!res.ok) throw new Error(`Papers With Code API error: ${res.status}`);

  const data = (await res.json()) as PaperListResponse;

  return {
    query,
    total: data.count,
    returned: data.results.length,
    papers: data.results.map(formatPaper),
  };
}

async function getPaper(id: string) {
  const res = await fetch(`${BASE_URL}/papers/${encodeURIComponent(id)}/`);
  if (!res.ok) throw new Error(`Papers With Code API error: ${res.status}`);

  const data = (await res.json()) as RawPaper;
  return formatPaper(data);
}

async function getRepositories(id: string) {
  const res = await fetch(`${BASE_URL}/papers/${encodeURIComponent(id)}/repositories/`);
  if (!res.ok) throw new Error(`Papers With Code API error: ${res.status}`);

  const data = (await res.json()) as RepositoryListResponse;

  return {
    paper_id: id,
    total: data.count,
    repositories: data.results.map(formatRepository),
  };
}

async function trendingPapers(limit: number) {
  const itemsPerPage = Math.min(Math.max(1, limit), 50);
  const params = new URLSearchParams({
    ordering: '-proceeding',
    items_per_page: String(itemsPerPage),
  });

  const res = await fetch(`${BASE_URL}/papers/?${params}`);
  if (!res.ok) throw new Error(`Papers With Code API error: ${res.status}`);

  const data = (await res.json()) as PaperListResponse;

  return {
    total: data.count,
    returned: data.results.length,
    papers: data.results.map(formatPaper),
  };
}

export default { tools, callTool } satisfies McpToolExport;
