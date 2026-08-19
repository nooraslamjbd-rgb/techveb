const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "nooraslamjbd-rgb/techveb";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents`;

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: string;
}

interface GitHubFileContent {
  sha: string;
  content: string;
  encoding: string;
}

interface GitHubDeleteResponse {
  commit: { sha: string; message: string };
}

const headers = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "TechVeb-Admin",
};

export async function listDirectory(dir: string): Promise<GitHubFile[]> {
  const res = await fetch(`${API_BASE}/src/content/${dir}`, {
    headers,
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  return res.json();
}

export async function getFileContent(
  dir: string,
  slug: string
): Promise<{ content: string; sha: string; frontmatter: Record<string, unknown>; body: string }> {
  const res = await fetch(`${API_BASE}/src/content/${dir}/${slug}.mdx`, {
    headers,
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data: GitHubFileContent = await res.json();
  const decoded = atob(data.content);

  const fmMatch = decoded.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) return { content: decoded, sha: data.sha, frontmatter: {}, body: decoded };

  const fmLines = fmMatch[1].split("\n");
  const frontmatter: Record<string, unknown> = {};
  let currentKey = "";
  let inArray = false;

  for (const line of fmLines) {
    const kvMatch = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val === "[") {
        inArray = true;
        frontmatter[currentKey] = [];
      } else if (val.startsWith("[") && val.endsWith("]")) {
        frontmatter[currentKey] = val
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^["']|["']$/g, ""));
        inArray = false;
      } else if (val === "true") {
        frontmatter[currentKey] = true;
        inArray = false;
      } else if (val === "false") {
        frontmatter[currentKey] = false;
        inArray = false;
      } else {
        frontmatter[currentKey] = val.replace(/^["']|["']$/g, "");
        inArray = false;
      }
    } else if (inArray && currentKey && line.match(/^\s*-\s+(.+)/)) {
      const arrMatch = line.match(/^\s*-\s+(.+)/);
      if (arrMatch) {
        (frontmatter[currentKey] as string[]).push(
          arrMatch[1].trim().replace(/^["']|["']$/g, "")
        );
      }
    }
  }

  return {
    content: decoded,
    sha: data.sha,
    frontmatter,
    body: fmMatch[2],
  };
}

export async function createFile(
  dir: string,
  slug: string,
  content: string,
  message: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/src/content/${dir}/${slug}.mdx`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: btoa(content),
      branch: GITHUB_BRANCH,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${res.status} ${JSON.stringify(err)}`);
  }
}

export async function updateFile(
  dir: string,
  slug: string,
  content: string,
  sha: string,
  message: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/src/content/${dir}/${slug}.mdx`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: btoa(content),
      sha,
      branch: GITHUB_BRANCH,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${res.status} ${JSON.stringify(err)}`);
  }
}

export async function deleteFile(
  dir: string,
  slug: string,
  sha: string,
  message: string
): Promise<void> {
  const res = await fetch(`${API_BASE}/src/content/${dir}/${slug}.mdx`, {
    method: "DELETE",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${res.status} ${JSON.stringify(err)}`);
  }
}

export async function uploadImage(
  filename: string,
  base64Content: string,
  message: string
): Promise<string> {
  const res = await fetch(`${API_BASE}/public/images/${filename}`, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: GITHUB_BRANCH,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub API error: ${res.status} ${JSON.stringify(err)}`);
  }
  return `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}/public/images/${filename}`;
}
