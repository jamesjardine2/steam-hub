// Checks the source links in src/_data/lenses.json. Run it once a term:
//
//   npm run check-links            report only
//   npm run check-links -- --write also set "checked" to today on every
//                                  node whose links all worked
//
// It requests every source_url and further url, except on nodes marked
// requires_login and on Arc or Google Drive links (they need a login).
// It reports dead links (4xx or 5xx), links that gave no answer (some
// government sites refuse scripted requests, so open those in a browser),
// and nodes still marked verified: false.

import fs from "node:fs";
import path from "node:path";

const FILE = path.join(process.cwd(), "src", "_data", "lenses.json");
const WRITE = process.argv.includes("--write");
const LOGIN_HOSTS = ["arc.educationapps.vic.gov.au", "drive.google.com", "docs.google.com"];
const TIMEOUT = 20000;

const data = JSON.parse(fs.readFileSync(FILE, "utf8"));
const nodes = data.nodes || {};

function needsLogin(url) {
  try {
    return LOGIN_HOSTS.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

// HEAD first; some servers refuse it, so fall back to GET.
async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT),
        headers: { "user-agent": "Mozilla/5.0 (FCPS STEAM hub link check)" },
      });
      if (res.ok) return { ok: true, status: res.status };
      if (method === "GET") return { ok: false, status: res.status };
    } catch (e) {
      if (method === "GET") return { ok: false, status: e.name === "TimeoutError" ? "timed out" : e.cause?.code || e.message };
    }
  }
}

// Every link worth requesting, grouped by node.
const jobs = {};
let skipped = 0;
for (const [id, n] of Object.entries(nodes)) {
  const urls = [n.source_url, ...(n.further || []).map((f) => f.url)].filter(Boolean);
  for (const url of urls) {
    if (n.requires_login || needsLogin(url)) { skipped++; continue; }
    (jobs[id] ||= []).push(url);
  }
}

const unique = [...new Set(Object.values(jobs).flat())];
console.log(`Checking ${unique.length} links (${skipped} skipped because they need a login)...\n`);
const results = new Map();
await Promise.all(unique.map(async (url) => results.set(url, await check(url))));

const dead = [];
for (const [id, urls] of Object.entries(jobs)) {
  for (const url of urls) {
    const r = results.get(url);
    if (!r.ok) dead.push({ id, url, status: r.status });
  }
}

// A status number means the server answered with an error; anything else
// (refused, reset, timed out) means it could not be reached from here.
const errors = dead.filter((d) => typeof d.status === "number");
const unreachable = dead.filter((d) => typeof d.status !== "number");
console.log(errors.length ? `Dead links (${errors.length}):` : "Dead links: none.");
for (const d of errors) console.log(`  ${d.id}: ${d.status}  ${d.url}`);
if (unreachable.length) {
  console.log(`\nNo answer, check these in a browser (${unreachable.length}):`);
  for (const d of unreachable) console.log(`  ${d.id}: ${d.status}  ${d.url}`);
}

const unverified = Object.entries(nodes).filter(([, n]) => n.verified === false);
console.log(`\nNot verified yet (${unverified.length}):`);
for (const [id, n] of unverified) {
  console.log(`  ${id}: ${n.label}${n.source_url ? "" : " (no link)"}`);
}

// --write changes only the "checked" values, so the file keeps its layout.
if (WRITE) {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Melbourne" });
  let text = fs.readFileSync(FILE, "utf8");
  let updated = 0;
  for (const [id, urls] of Object.entries(jobs)) {
    if (!urls.every((url) => results.get(url).ok)) continue;
    const start = text.indexOf(`${JSON.stringify(id)}: {`);
    if (start < 0) continue;
    const rest = text.slice(start).replace(/"checked":\s*(null|"[^"]*")/, `"checked": "${today}"`);
    text = text.slice(0, start) + rest;
    updated++;
  }
  fs.writeFileSync(FILE, text);
  console.log(`\nSet checked to ${today} on ${updated} nodes in src/_data/lenses.json.`);
}

process.exitCode = errors.length ? 1 : 0;
