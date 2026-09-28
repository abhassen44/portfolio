/**
 * GitHub API Data Types
 */

export interface GitHubOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

export interface GitHubLicense {
  key: string;
  name: string;
  spdx_id: string;
  url: string | null;
}

export interface GitHubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: GitHubOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: GitHubLicense | null;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: string;
  default_branch: string;

  // Custom calculated fields for portfolio UI
  category?: ProjectCategory;
  isFeatured?: boolean;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export type ProjectCategory =
  | "All"
  | "AI / ML"
  | "Generative AI"
  | "Full Stack"
  | "Frontend"
  | "Backend"
  | "Systems"
  | "Other";

export type ProjectSortOption =
  | "updated"
  | "stars"
  | "created"
  | "featured";

export interface RepoReadmeResult {
  content: string;
  encoding: string;
  name: string;
  path: string;
}
