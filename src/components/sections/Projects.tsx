import React, { useState, useEffect, useMemo, useRef } from "react";
import { GitHubRepo, GitHubUser, ProjectCategory, ProjectSortOption } from "../../lib/github/types";
import { fetchGitHubData } from "../../lib/github/api";
import { portfolioConfig } from "../../config/portfolio";
import { ProjectCard } from "../github/ProjectCard";
import { ProjectModal } from "../github/ProjectModal";
import {
  Search,
  Filter,
  RefreshCw,
  GitBranch,
  ArrowUpDown,
  Github,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Settings2
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Projects: React.FC = () => {
  const [username, setUsername] = useState<string>(portfolioConfig.github.username);
  const [inputUsername, setInputUsername] = useState<string>(portfolioConfig.github.username);
  const [isCustomUserOpen, setIsCustomUserOpen] = useState(false);

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [ghUser, setGhUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fromCache, setFromCache] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);

  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<ProjectSortOption>("updated");

  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Load GitHub repositories
  const loadData = async (user: string, force = false) => {
    setLoading(true);
    try {
      const res = await fetchGitHubData(user, force);
      setRepos(res.repos);
      setGhUser(res.user);
      setFromCache(res.fromCache);
      setRateLimited(res.rateLimited);
    } catch {
      // Handled inside fetchGitHubData fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(username, false);
  }, [username]);

  // Handle switching GitHub handle
  const handleApplyUsername = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;
    const clean = inputUsername.trim();
    setUsername(clean);
    setIsCustomUserOpen(false);
    loadData(clean, true);
  };

  // Categories list
  const categories: ProjectCategory[] = [
    "All",
    "AI / ML",
    "Generative AI",
    "Full Stack",
    "Frontend",
    "Backend",
    "Systems",
  ];

  // Filter and Sort Repositories
  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((r) => r.category === activeCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.topics && r.topics.some((t) => t.toLowerCase().includes(q))) ||
          (r.language && r.language.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === "featured") {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
      }
      if (sortOption === "stars") {
        return b.stargazers_count - a.stargazers_count;
      }
      if (sortOption === "created") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // default: updated
      return new Date(b.pushed_at || b.updated_at).getTime() - new Date(a.pushed_at || a.updated_at).getTime();
    });

    return result;
  }, [repos, activeCategory, searchQuery, sortOption]);

  // GSAP ScrollTrigger for cards entering viewport
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || loading) return;

    const ctx = gsap.context(() => {
      const cards = gridRef.current?.querySelectorAll(".project-card");
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          y: 35,
          opacity: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredRepos, loading]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-[#F7FAF8] dark:bg-[#0A120D]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header & Source of Truth Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest uppercase text-[#166534] dark:text-[#22C55E]">
                03. Dynamic Source of Truth
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111827] dark:text-white">
                Live GitHub Repositories
              </h2>
              <p className="text-sm text-[#4B5563] dark:text-[#A7B0AA] max-w-xl">
                Automatically synchronized with GitHub API. Repository descriptions, topics, stars, and language telemetry are dynamic and cache-revalidated.
              </p>
            </div>

            {/* Sync Status / Config Trigger */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#0D1711] text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                <Github className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                <span className="text-[#111827] dark:text-white font-medium">@{username}</span>
                <span aria-hidden="true">·</span>
                <span>{repos.length} public repos</span>
              </div>

              <button
                onClick={() => loadData(username, true)}
                disabled={loading}
                title="Force refresh from GitHub API"
                className="p-2 border border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#0D1711] text-[#111827] dark:text-white hover:text-[#166534] dark:hover:text-[#22C55E] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#166534] dark:text-[#22C55E]" : ""}`} />
              </button>

              <button
                onClick={() => setIsCustomUserOpen(!isCustomUserOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono border border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#0D1711] text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#111827] dark:hover:text-white transition-colors cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5" />
                <span>Change User</span>
              </button>
            </div>
          </div>

          {/* Change GitHub Username Drawer */}
          {isCustomUserOpen && (
            <div className="p-4 bg-white dark:bg-[#0D1711] border border-[#166534] dark:border-[#22C55E] space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#166534] dark:text-[#22C55E] font-medium">
                  Switch Active GitHub Source Account
                </span>
                <span className="text-[#4B5563] dark:text-[#A7B0AA]">
                  Default configured in portfolioConfig.github.username
                </span>
              </div>
              <form onSubmit={handleApplyUsername} className="flex gap-2">
                <input
                  type="text"
                  value={inputUsername}
                  onChange={(e) => setInputUsername(e.target.value)}
                  placeholder="Enter GitHub username (e.g. abhassen, torvalds)"
                  className="flex-1 px-3 py-2 text-xs font-mono bg-[#F7FAF8] dark:bg-[#050805] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white focus:border-[#166534] dark:focus:border-[#22C55E] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-[#166534] dark:bg-[#22C55E] text-white dark:text-black font-semibold hover:bg-[#14532D] dark:hover:bg-[#16a34a] transition-colors cursor-pointer"
                >
                  Fetch
                </button>
              </form>
            </div>
          )}

          {/* Rate Limit / Cache Notice if applicable */}
          {rateLimited && (
            <div className="p-3 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] text-xs font-mono flex items-center justify-between text-[#4B5563] dark:text-[#A7B0AA]">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#166534] dark:text-[#22C55E]" />
                <span>
                  GitHub API rate-limit detected for unauthenticated requests. Showing cached / domain fallback projects.
                </span>
              </div>
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#166534] dark:text-[#22C55E] hover:text-[#14532D]"
              >
                View directly on GitHub →
              </a>
            </div>
          )}

          {/* Interactive Filter and Controls Bar */}
          <div className="space-y-4">
            {/* Category Segmented Controls (Interactive buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-mono tracking-wide uppercase transition-colors shrink-0 cursor-pointer border ${
                      isActive
                        ? "bg-[#166534] text-white border-[#166534] dark:bg-[#22C55E] dark:text-black dark:border-[#22C55E] font-semibold"
                        : "bg-white dark:bg-[#0D1711] text-[#4B5563] dark:text-[#A7B0AA] border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] hover:text-[#111827] dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input & Sort Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563] dark:text-[#A7B0AA]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword, topic, language, or title..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white focus:border-[#166534] dark:focus:border-[#22C55E] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA] hover:text-[#111827] dark:hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA] flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort:</span>
                </span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as ProjectSortOption)}
                  className="px-3 py-2 text-xs font-mono bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] text-[#111827] dark:text-white focus:border-[#166534] dark:focus:border-[#22C55E] focus:outline-none cursor-pointer"
                >
                  <option value="updated">Recently Updated</option>
                  <option value="featured">Featured First</option>
                  <option value="stars">Most Stars</option>
                  <option value="created">Recently Created</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Results Counter */}
          <div className="flex items-center justify-between text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA] pt-2">
            <span>
              Showing {filteredRepos.length} of {repos.length} repositories
            </span>
            {fromCache && (
              <span className="text-[11px] text-[#166534] dark:text-[#22C55E]">
                ● Cached Response
              </span>
            )}
          </div>

          {/* Project Cards Grid or Loading/Empty States */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-6 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] animate-pulse space-y-4"
                >
                  <div className="h-4 bg-[#F7FAF8] dark:bg-[#050805] w-1/3" />
                  <div className="h-6 bg-[#F7FAF8] dark:bg-[#050805] w-3/4" />
                  <div className="h-12 bg-[#F7FAF8] dark:bg-[#050805] w-full" />
                  <div className="h-4 bg-[#F7FAF8] dark:bg-[#050805] w-1/2 pt-4" />
                </div>
              ))}
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] space-y-4">
              <div className="font-mono text-sm text-[#111827] dark:text-white">
                No repositories match your active filter criteria.
              </div>
              <p className="text-xs text-[#4B5563] dark:text-[#A7B0AA]">
                Try adjusting the category or search keywords to view other repositories.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-[#166534] dark:border-[#22C55E] text-[#166534] dark:text-[#22C55E] hover:bg-[#166534] hover:text-white dark:hover:bg-[#22C55E] dark:hover:text-black transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredRepos.map((repo) => (
                <ProjectCard
                  key={repo.id}
                  repo={repo}
                  onOpenModal={(r) => setSelectedRepo(r)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Details & README Modal */}
      <ProjectModal
        repo={selectedRepo}
        onClose={() => setSelectedRepo(null)}
      />
    </section>
  );
};
