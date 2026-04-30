import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../api/_github.json");
const USER = "OluwatimilehinK";

const headers = { "User-Agent": `${USER}-portfolio` };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function main() {
  const url = `https://api.github.com/users/${USER}/repos?sort=updated&per_page=30&type=owner`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const repos = await res.json();

  const slim = repos
    .filter((r) => !r.fork && !r.archived)
    .map((r) => ({
      name: r.name,
      description: r.description,
      language: r.language,
      topics: r.topics ?? [],
      stars: r.stargazers_count,
      url: r.html_url,
      homepage: r.homepage || null,
      pushed_at: r.pushed_at,
    }));

  if (!existsSync(dirname(OUT))) mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(
    OUT,
    JSON.stringify({ user: USER, fetched_at: new Date().toISOString(), repos: slim }, null, 2),
  );
  console.log(`fetch-github: wrote ${slim.length} repos to ${OUT}`);
}

main().catch((err) => {
  console.error("fetch-github failed:", err.message);
  // Don't fail the build — write an empty fallback so the API still works.
  try {
    if (!existsSync(dirname(OUT))) mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify({ user: USER, fetched_at: null, repos: [] }, null, 2));
  } catch {}
  process.exit(0);
});
