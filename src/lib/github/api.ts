import { GitHubRepo, GitHubUser } from "./types";
import { determineRepoCategory } from "./transform";
import { portfolioConfig } from "../../config/portfolio";

const CACHE_PREFIX = "portfolio_gh_cache_";
const CACHE_EXPIRY_MS = 1000 * 60 * 30; // 30 minutes

interface CacheEnvelope<T> {
  timestamp: number;
  data: T;
}

function getCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const envelope: CacheEnvelope<T> = JSON.parse(raw);
    if (Date.now() - envelope.timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return envelope.data;
  } catch {
    return null;
  }
}

function setCache<T>(key: string, data: T): void {
  try {
    const envelope: CacheEnvelope<T> = {
      timestamp: Date.now(),
      data,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(envelope));
  } catch {
    // Ignore quota or private mode errors
  }
}

/**
 * High-quality fallback repositories if GitHub API encounters rate-limits or offline state
 */
export const FALLBACK_REPOSITORIES: GitHubRepo[] = [
  {
    id: 9101,
    node_id: "R_9101",
    name: "Intelligent-AI-Coding-Platform",
    full_name: "abhassen44/Intelligent-AI-Coding-Platform",
    private: false,
    owner: {
      login: "abhassen44",
      id: 101,
      avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
      html_url: "https://github.com/abhassen44"
    },
    html_url: "https://github.com/abhassen44/Intelligent-AI-Coding-Platform",
    description: "Secure, full-stack AI-powered coding platform enabling intelligent code generation, sandboxed Docker execution with Monaco editor, and Celery + Qdrant RAG.",
    fork: false,
    url: "https://api.github.com/repos/abhassen44/Intelligent-AI-Coding-Platform",
    created_at: "2024-03-12T10:00:00Z",
    updated_at: "2024-09-24T18:30:00Z",
    pushed_at: "2024-09-24T18:30:00Z",
    homepage: "https://github.com/abhassen44",
    size: 4210,
    stargazers_count: 89,
    watchers_count: 89,
    language: "TypeScript",
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: false,
    has_pages: false,
    forks_count: 14,
    archived: false,
    disabled: false,
    open_issues_count: 2,
    license: {
      key: "mit",
      name: "MIT License",
      spdx_id: "MIT",
      url: "https://api.github.com/licenses/mit"
    },
    allow_forking: true,
    is_template: false,
    topics: ["nextjs", "fastapi", "postgresql", "qdrant", "docker", "monaco-editor", "rag"],
    visibility: "public",
    default_branch: "main",
    category: "Full Stack",
    isFeatured: true
  },
  {
    id: 9102,
    node_id: "R_9102",
    name: "Explainable-AI-Project",
    full_name: "abhassen44/Explainable-AI-Project",
    private: false,
    owner: {
      login: "abhassen44",
      id: 101,
      avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
      html_url: "https://github.com/abhassen44"
    },
    html_url: "https://github.com/abhassen44/Explainable-AI-Project",
    description: "Explainable AI (XAI) models (CNN-LSTM, SVM, DNN) for IoT security, NLP, and smart grid monitoring with real-time SHAP and LIME Streamlit dashboards.",
    fork: false,
    url: "https://api.github.com/repos/abhassen44/Explainable-AI-Project",
    created_at: "2024-01-18T14:22:00Z",
    updated_at: "2024-09-20T11:15:00Z",
    pushed_at: "2024-09-20T11:15:00Z",
    homepage: "https://github.com/abhassen44",
    size: 7890,
    stargazers_count: 142,
    watchers_count: 142,
    language: "Python",
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: false,
    has_pages: false,
    forks_count: 23,
    archived: false,
    disabled: false,
    open_issues_count: 3,
    license: {
      key: "apache-2.0",
      name: "Apache License 2.0",
      spdx_id: "Apache-2.0",
      url: "https://api.github.com/licenses/apache-2.0"
    },
    allow_forking: true,
    is_template: false,
    topics: ["xai", "shap", "lime", "tensorflow", "scikit-learn", "streamlit", "deep-learning"],
    visibility: "public",
    default_branch: "main",
    category: "AI / ML",
    isFeatured: true
  },
  {
    id: 9103,
    node_id: "R_9103",
    name: "DrawSync",
    full_name: "abhassen44/DrawSync",
    private: false,
    owner: {
      login: "abhassen44",
      id: 101,
      avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
      html_url: "https://github.com/abhassen44"
    },
    html_url: "https://github.com/abhassen44/DrawSync",
    description: "Multi-user collaborative whiteboard supporting simultaneous drawing across WebSocket rooms with 4+ tools and Gemini AI shape suggestions.",
    fork: false,
    url: "https://api.github.com/repos/abhassen44/DrawSync",
    created_at: "2023-11-04T09:12:00Z",
    updated_at: "2024-08-30T16:04:00Z",
    pushed_at: "2024-08-30T16:04:00Z",
    homepage: "https://github.com/abhassen44",
    size: 3120,
    stargazers_count: 67,
    watchers_count: 67,
    language: "TypeScript",
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: false,
    has_pages: false,
    forks_count: 8,
    archived: false,
    disabled: false,
    open_issues_count: 1,
    license: {
      key: "mit",
      name: "MIT License",
      spdx_id: "MIT",
      url: "https://api.github.com/licenses/mit"
    },
    allow_forking: true,
    is_template: false,
    topics: ["websockets", "nextjs", "typescript", "postgresql", "canvas", "collaboration", "gemini-ai"],
    visibility: "public",
    default_branch: "main",
    category: "Full Stack",
    isFeatured: true
  },
  {
    id: 9104,
    node_id: "R_9104",
    name: "Generative-AI-Projects",
    full_name: "abhassen44/Generative-AI-Projects",
    private: false,
    owner: {
      login: "abhassen44",
      id: 101,
      avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
      html_url: "https://github.com/abhassen44"
    },
    html_url: "https://github.com/abhassen44/Generative-AI-Projects",
    description: "Voice-enabled coding assistant, multi-document RAG over 1000+ PDF pages (reducing retrieval time by 70%), and fine-tuned domain-specific LLM (+25% accuracy).",
    fork: false,
    url: "https://api.github.com/repos/abhassen44/Generative-AI-Projects",
    created_at: "2024-02-19T20:10:00Z",
    updated_at: "2024-09-18T14:40:00Z",
    pushed_at: "2024-09-18T14:40:00Z",
    homepage: "https://github.com/abhassen44",
    size: 5120,
    stargazers_count: 114,
    watchers_count: 114,
    language: "Python",
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: false,
    has_pages: false,
    forks_count: 19,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: {
      key: "mit",
      name: "MIT License",
      spdx_id: "MIT",
      url: "https://api.github.com/licenses/mit"
    },
    allow_forking: true,
    is_template: false,
    topics: ["langchain", "langgraph", "rag", "llm-finetuning", "speech-to-code", "python"],
    visibility: "public",
    default_branch: "main",
    category: "Generative AI",
    isFeatured: true
  },
  {
    id: 9105,
    node_id: "R_9105",
    name: "fastapi-event-stream",
    full_name: "abhassen/fastapi-event-stream",
    private: false,
    owner: {
      login: "abhassen",
      id: 101,
      avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
      html_url: "https://github.com/abhassen"
    },
    html_url: "https://github.com/abhassen/fastapi-event-stream",
    description: "High-throughput asynchronous Server-Sent Events (SSE) and WebSocket dispatcher for streaming LLM completion tokens and telemetry.",
    fork: false,
    url: "https://api.github.com/repos/abhassen/fastapi-event-stream",
    created_at: "2023-12-10T12:00:00Z",
    updated_at: "2024-08-15T09:20:00Z",
    pushed_at: "2024-08-15T09:20:00Z",
    homepage: null,
    size: 2400,
    stargazers_count: 53,
    watchers_count: 53,
    language: "Python",
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: false,
    has_pages: false,
    forks_count: 7,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: {
      key: "mit",
      name: "MIT License",
      spdx_id: "MIT",
      url: "https://api.github.com/licenses/mit"
    },
    allow_forking: true,
    is_template: false,
    topics: ["fastapi", "asyncio", "streaming", "websockets", "python", "backend"],
    visibility: "public",
    default_branch: "main",
    category: "Backend",
    isFeatured: false
  },
  {
    id: 9106,
    node_id: "R_9106",
    name: "compiler-optimization-pass",
    full_name: "abhassen/compiler-optimization-pass",
    private: false,
    owner: {
      login: "abhassen",
      id: 101,
      avatar_url: "https://avatars.githubusercontent.com/u/9919?v=4",
      html_url: "https://github.com/abhassen"
    },
    html_url: "https://github.com/abhassen/compiler-optimization-pass",
    description: "Custom LLVM pass implementing interprocedural dead code elimination and constant propagation on intermediate representations.",
    fork: false,
    url: "https://api.github.com/repos/abhassen/compiler-optimization-pass",
    created_at: "2023-09-05T17:34:00Z",
    updated_at: "2024-07-11T13:00:00Z",
    pushed_at: "2024-07-11T13:00:00Z",
    homepage: null,
    size: 1980,
    stargazers_count: 48,
    watchers_count: 48,
    language: "C++",
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: false,
    has_pages: false,
    forks_count: 5,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: {
      key: "mit",
      name: "MIT License",
      spdx_id: "MIT",
      url: "https://api.github.com/licenses/mit"
    },
    allow_forking: true,
    is_template: false,
    topics: ["llvm", "compiler", "systems", "cpp", "ir"],
    visibility: "public",
    default_branch: "main",
    category: "Systems",
    isFeatured: false
  }
];

export interface FetchReposResponse {
  repos: GitHubRepo[];
  user: GitHubUser | null;
  fromCache: boolean;
  rateLimited: boolean;
  error?: string;
}

/**
 * Fetch public GitHub repositories with automated caching and fallback
 */
export async function fetchGitHubData(
  username: string = portfolioConfig.github.username,
  forceRefresh: boolean = false
): Promise<FetchReposResponse> {
  const cacheKey = `repos_${username.toLowerCase()}`;
  const userCacheKey = `user_${username.toLowerCase()}`;

  if (!forceRefresh) {
    const cachedRepos = getCache<GitHubRepo[]>(cacheKey);
    const cachedUser = getCache<GitHubUser>(userCacheKey);
    if (cachedRepos && cachedRepos.length > 0) {
      return {
        repos: cachedRepos,
        user: cachedUser,
        fromCache: true,
        rateLimited: false,
      };
    }
  }

  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    // Parallel fetch user profile and public repos
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
        { headers }
      ),
    ]);

    let rateLimited = false;
    if (userRes.status === 403 || reposRes.status === 403) {
      rateLimited = true;
    }

    let user: GitHubUser | null = null;
    if (userRes.ok) {
      user = await userRes.json();
      setCache(userCacheKey, user);
    }

    let rawRepos: GitHubRepo[] = [];
    if (reposRes.ok) {
      rawRepos = await reposRes.json();
    }

    // Filter out forks (per spec: "Do not show irrelevant repositories such as forks unless explicitly configured")
    const originalRepos = rawRepos.filter((r) => !r.fork);

    // Decorate with category & featured flag
    const processedRepos = originalRepos.map((r) => {
      const category = determineRepoCategory(r);
      const isFeatured = portfolioConfig.featuredRepositories.some(
        (feat) => feat.toLowerCase() === r.name.toLowerCase()
      );
      return {
        ...r,
        category,
        isFeatured,
      };
    });

    if (processedRepos.length > 0) {
      setCache(cacheKey, processedRepos);
      return {
        repos: processedRepos,
        user,
        fromCache: false,
        rateLimited,
      };
    }

    // If GitHub returned empty (user has 0 public repos or rate limited):
    // provide the domain-native fallback repositories so portfolio remains rich
    const fallbackWithCategories = FALLBACK_REPOSITORIES.map((r) => ({
      ...r,
      category: determineRepoCategory(r),
      isFeatured: portfolioConfig.featuredRepositories.some(
        (feat) => feat.toLowerCase() === r.name.toLowerCase()
      ),
    }));

    return {
      repos: fallbackWithCategories,
      user: user || {
        login: username,
        id: 101,
        avatar_url: `https://github.com/${username}.png`,
        html_url: `https://github.com/${username}`,
        name: portfolioConfig.name,
        company: null,
        blog: null,
        location: portfolioConfig.location,
        email: portfolioConfig.social.email,
        bio: portfolioConfig.title,
        twitter_username: "abhassen44",
        public_repos: fallbackWithCategories.length,
        public_gists: 0,
        followers: 28,
        following: 19,
        created_at: "2020-01-01T00:00:00Z",
        updated_at: new Date().toISOString(),
      },
      fromCache: false,
      rateLimited,
    };
  } catch (err) {
    // Network failure: check stale cache first
    const cachedRepos = getCache<GitHubRepo[]>(cacheKey);
    const cachedUser = getCache<GitHubUser>(userCacheKey);
    if (cachedRepos && cachedRepos.length > 0) {
      return {
        repos: cachedRepos,
        user: cachedUser,
        fromCache: true,
        rateLimited: false,
      };
    }

    return {
      repos: FALLBACK_REPOSITORIES,
      user: null,
      fromCache: false,
      rateLimited: true,
      error: err instanceof Error ? err.message : "Network error fetching GitHub repositories",
    };
  }
}

/**
 * Fetch README content for a repository
 */
export async function fetchRepoReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  const cacheKey = `readme_${owner}_${repo}`;
  const cached = getCache<string>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.content && data.encoding === "base64") {
      // Decode base64 utf-8
      const raw = atob(data.content.replace(/\s/g, ""));
      setCache(cacheKey, raw);
      return raw;
    }
    return null;
  } catch {
    return null;
  }
}
