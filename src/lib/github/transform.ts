import { GitHubRepo, ProjectCategory } from "./types";

/**
 * Intelligent categorization of GitHub repositories based on:
 * - GitHub topics
 * - Primary programming language
 * - Repository name and description keywords
 */
export function determineRepoCategory(repo: GitHubRepo): ProjectCategory {
  const topics = (repo.topics || []).map((t) => t.toLowerCase());
  const name = repo.name.toLowerCase();
  const desc = (repo.description || "").toLowerCase();
  const lang = (repo.language || "").toLowerCase();

  // 1. Generative AI check
  const genAiKeywords = [
    "llm",
    "gpt",
    "rag",
    "langchain",
    "langgraph",
    "gemini",
    "claude",
    "openai",
    "generative-ai",
    "prompt",
    "diffusion",
    "agent",
    "agents"
  ];
  if (
    topics.some((t) => genAiKeywords.some((k) => t.includes(k))) ||
    genAiKeywords.some((k) => desc.includes(k) || name.includes(k))
  ) {
    return "Generative AI";
  }

  // 2. AI / ML check
  const aiKeywords = [
    "machine-learning",
    "deep-learning",
    "ml",
    "ai",
    "pytorch",
    "tensorflow",
    "neural",
    "computer-vision",
    "nlp",
    "transformer",
    "embedding",
    "qdrant",
    "vector"
  ];
  if (
    topics.some((t) => aiKeywords.some((k) => t.includes(k))) ||
    aiKeywords.some((k) => desc.includes(k) || name.includes(k))
  ) {
    return "AI / ML";
  }

  // 3. Systems check
  const systemsKeywords = [
    "c++",
    "cpp",
    "rust",
    "systems",
    "compiler",
    "operating-system",
    "cuda",
    "kernel",
    "distributed",
    "networking",
    "low-level",
    "concurrency",
    "queue"
  ];
  if (
    lang === "c++" ||
    lang === "c" ||
    lang === "rust" ||
    topics.some((t) => systemsKeywords.some((k) => t.includes(k))) ||
    systemsKeywords.some((k) => desc.includes(k) || name.includes(k))
  ) {
    return "Systems";
  }

  // 4. Frontend check
  const frontendKeywords = [
    "frontend",
    "ui",
    "css",
    "tailwind",
    "html",
    "vite",
    "design-system",
    "component",
    "threejs",
    "webgl",
    "canvas"
  ];
  if (
    (lang === "css" || lang === "html") ||
    topics.some((t) => frontendKeywords.some((k) => t.includes(k))) ||
    (frontendKeywords.some((k) => desc.includes(k)) && !desc.includes("backend"))
  ) {
    return "Frontend";
  }

  // 5. Backend check
  const backendKeywords = [
    "backend",
    "api",
    "fastapi",
    "express",
    "microservice",
    "database",
    "sql",
    "redis",
    "docker",
    "kubernetes",
    "grpc",
    "server"
  ];
  if (
    topics.some((t) => backendKeywords.some((k) => t.includes(k))) ||
    backendKeywords.some((k) => desc.includes(k) || name.includes(k))
  ) {
    return "Backend";
  }

  // 6. Full Stack check
  if (
    (lang === "typescript" || lang === "javascript" || lang === "python") &&
    (topics.includes("fullstack") ||
      topics.includes("nextjs") ||
      topics.includes("react") ||
      desc.includes("full-stack") ||
      desc.includes("fullstack") ||
      desc.includes("web app"))
  ) {
    return "Full Stack";
  }

  // Fallback check on languages
  if (lang === "typescript" || lang === "javascript") return "Full Stack";
  if (lang === "python") return "AI / ML";

  return "Other";
}

/**
 * Solid color mapping for primary languages (zero gradients)
 */
export function getLanguageColor(language: string | null): string {
  if (!language) return "#4B5563";

  const map: Record<string, string> = {
    TypeScript: "#3178C6",
    JavaScript: "#EAB308",
    Python: "#3776AB",
    "C++": "#00599C",
    C: "#555555",
    Rust: "#DEA584",
    Go: "#00ADD8",
    HTML: "#E34F26",
    CSS: "#1572B6",
    Shell: "#89E051",
    Java: "#B07219",
    SQL: "#E38C00",
  };

  return map[language] || "#166534";
}

/**
 * Format date in clean human readable notation
 */
export function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Updated today";
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 7) return `Updated ${diffDays}d ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `Updated ${Math.floor(diffDays / 30)}mo ago`;

    return `Updated ${date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
  } catch {
    return "Updated recently";
  }
}

/**
 * Clean repository display title
 */
export function cleanRepoTitle(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
