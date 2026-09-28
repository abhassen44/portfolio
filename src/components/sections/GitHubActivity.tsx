import React, { useEffect, useState, useRef } from "react";
import { GitHubUser, GitHubRepo } from "../../lib/github/types";
import { fetchGitHubData } from "../../lib/github/api";
import { portfolioConfig } from "../../config/portfolio";
import { formatRelativeDate, getLanguageColor } from "../../lib/github/transform";
import {
  Github,
  Users,
  GitPullRequest,
  Star,
  ExternalLink,
  Code,
  Calendar,
  Layers
} from "lucide-react";

export const GitHubActivity: React.FC = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [recentRepos, setRecentRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardsVisible, setCardsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let mounted = true;
    fetchGitHubData(portfolioConfig.github.username).then((res) => {
      if (mounted) {
        setUser(res.user);
        // Take top 4 most recently pushed repositories
        const sorted = [...res.repos].sort(
          (a, b) =>
            new Date(b.pushed_at || b.updated_at).getTime() -
            new Date(a.pushed_at || a.updated_at).getTime()
        );
        setRecentRepos(sorted.slice(0, 4));
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setCardsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 border-t border-[#DDE8E1] dark:border-[#1B3022] bg-white dark:bg-[#050805]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono tracking-widest uppercase text-[#166534] dark:text-[#22C55E]">
                Telemetry & Network
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] dark:text-white">
                Live GitHub Activity
              </h2>
            </div>

            <a
              href={`https://github.com/${portfolioConfig.github.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#166534] dark:text-[#22C55E] hover:underline"
            >
              <span>View GitHub profile @{portfolioConfig.github.username}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* User Telemetry Bar */}
          {user && (
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-[#F7FAF8] dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] transition-all duration-700 ease-out"
              style={{
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? "translateY(0)" : "translateY(20px)",
              }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                  <Layers className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                  <span>Public Repositories</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#111827] dark:text-white">
                  {user.public_repos}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                  <Users className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                  <span>Followers</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#111827] dark:text-white">
                  {user.followers}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                  <Users className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                  <span>Following</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#111827] dark:text-white">
                  {user.following}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                  <Calendar className="w-3.5 h-3.5 text-[#166534] dark:text-[#22C55E]" />
                  <span>Account Active Since</span>
                </div>
                <div className="text-sm sm:text-base font-bold font-mono text-[#111827] dark:text-white mt-1">
                  {new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Recent Pushes / Commits */}
          <div className="space-y-4">
            <div className="text-xs font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#A7B0AA]">
              Recently Pushed Repositories
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentRepos.map((repo, idx) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 bg-white dark:bg-[#0D1711] border border-[#DDE8E1] dark:border-[#1B3022] hover:border-[#166534] dark:hover:border-[#22C55E] transition-all duration-700 ease-out block group"
                  style={{
                    opacity: cardsVisible ? 1 : 0,
                    transform: cardsVisible ? "translateY(0)" : "translateY(24px)",
                    transitionDelay: `${120 + idx * 80}ms`,
                  }}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA] mb-2">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                      <span>{repo.language || "Code"}</span>
                    </span>
                    <span>{formatRelativeDate(repo.pushed_at || repo.updated_at)}</span>
                  </div>

                  <h3 className="font-bold font-mono text-sm text-[#111827] dark:text-white group-hover:text-[#166534] dark:group-hover:text-[#22C55E] transition-colors truncate">
                    {repo.name}
                  </h3>

                  <p className="mt-1.5 text-xs text-[#4B5563] dark:text-[#A7B0AA] line-clamp-2">
                    {repo.description || "Active open-source repository."}
                  </p>

                  <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-[#4B5563] dark:text-[#A7B0AA]">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-[#166534] dark:text-[#22C55E]" />
                      <span>{repo.stargazers_count}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <GitPullRequest className="w-3 h-3" />
                      <span>{repo.default_branch}</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
