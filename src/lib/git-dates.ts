import { execFileSync } from "child_process";

let cache: Map<string, string> | null = null;

function cleanPath(p: string): string {
  let out = p.trim();
  if (out.startsWith('"') && out.endsWith('"')) {
    try {
      out = JSON.parse(out);
    } catch {
      out = out.slice(1, -1);
    }
  }
  return out;
}

function buildMap(): Map<string, string> {
  const map = new Map<string, string>();
  try {
    const out = execFileSync(
      "git",
      ["log", "--name-status", "--format=%cI", "--first-parent"],
      { cwd: process.cwd(), encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
    );
    let date: string | null = null;
    for (const rawLine of out.split("\n")) {
      const line = rawLine.trimEnd();
      if (/^\d{4}-\d{2}-\d{2}T/.test(line)) {
        date = line;
        continue;
      }
      if (!date || !line) continue;
      const tab = line.indexOf("\t");
      if (tab === -1) continue;
      const status = line.slice(0, tab).trim();
      let file: string;
      if (/^R\d+/.test(status)) {
        const parts = line.split("\t");
        file = parts[parts.length - 1];
      } else {
        file = line.slice(tab + 1);
      }
      file = cleanPath(file);
      if (file && !map.has(file)) map.set(file, date);
    }
  } catch {
    // git unavailable or no history: callers fall back to frontmatter dates
  }
  return map;
}

/**
 * Return the ISO commit date of the most recent commit that touched a
 * repo-relative path (renames included), or null when git metadata is
 * unavailable. Parsed in one git invocation and cached for the process
 * lifetime, so it stays cheap at build time even for thousands of files.
 */
export function getGitLastModified(repoPath: string): string | null {
  if (!cache) cache = buildMap();
  return cache.get(repoPath) ?? null;
}