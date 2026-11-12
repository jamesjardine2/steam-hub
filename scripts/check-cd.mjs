// Checks the CD objects (curriculum fact sheets) in content/cd/objects/
// against content/cd/cd.schema.json, plus a few rules a schema cannot say.
//
//   npm run check-cd              check every file, and that index.json is current
//   npm run check-cd -- --write   check, then rewrite content/cd/index.json
//
// No dependencies: the small validator below covers the parts of JSON Schema
// that cd.schema.json uses (type, const, enum, pattern, minLength, maxLength,
// minItems, maxItems, required, properties, additionalProperties: false,
// items, $ref, allOf, if and then).

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "content", "cd");
const OBJECTS = path.join(DIR, "objects");
const INDEX = path.join(DIR, "index.json");
const WRITE = process.argv.includes("--write");

const schema = JSON.parse(fs.readFileSync(path.join(DIR, "cd.schema.json"), "utf8"));
const curriculum = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "_data", "curriculum.json"), "utf8")).codes;

// ---- A small JSON Schema validator ----

const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : Number.isInteger(v) ? "integer" : typeof v);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function resolve(ref) {
  if (!ref.startsWith("#/")) throw new Error(`only local $ref is supported: ${ref}`);
  return ref.slice(2).split("/").reduce((node, key) => node[key], schema);
}

function validate(value, rule, where, errors) {
  if (rule.$ref) validate(value, resolve(rule.$ref), where, errors);
  const type = typeOf(value);
  if (rule.type && !(rule.type === type || (rule.type === "number" && type === "integer"))) {
    errors.push(`${where}: should be ${rule.type}, found ${type}`);
    return;
  }
  if ("const" in rule && !same(value, rule.const)) errors.push(`${where}: should be ${JSON.stringify(rule.const)}`);
  if (rule.enum && !rule.enum.some((e) => same(e, value))) errors.push(`${where}: "${value}" is not one of ${rule.enum.join(", ")}`);
  if (type === "string") {
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) errors.push(`${where}: "${value}" does not match ${rule.pattern}`);
    if (rule.minLength && value.length < rule.minLength) errors.push(`${where}: too short (at least ${rule.minLength} characters)`);
    if (rule.maxLength && value.length > rule.maxLength) errors.push(`${where}: too long (at most ${rule.maxLength} characters)`);
  }
  if (type === "array") {
    if (rule.minItems && value.length < rule.minItems) errors.push(`${where}: needs at least ${rule.minItems} item(s), found ${value.length}`);
    if (rule.maxItems && value.length > rule.maxItems) errors.push(`${where}: at most ${rule.maxItems} item(s), found ${value.length}`);
    if (rule.items) value.forEach((item, i) => validate(item, rule.items, `${where}[${i}]`, errors));
  }
  if (type === "object") {
    for (const key of rule.required || []) if (!(key in value)) errors.push(`${where}: "${key}" is missing`);
    for (const [key, v] of Object.entries(value)) {
      if (rule.properties && rule.properties[key]) validate(v, rule.properties[key], `${where}.${key}`, errors);
      else if (rule.additionalProperties === false) errors.push(`${where}: "${key}" is not a field in the schema`);
    }
  }
  for (const part of rule.allOf || []) validate(value, part, where, errors);
  if (rule.if) {
    const trial = [];
    validate(value, rule.if, where, trial);
    if (!trial.length && rule.then) validate(value, rule.then, where, errors);
  }
}

// ---- Rules beyond the schema ----

// Every object that has a status, with where it sits in the file.
function statusFields(value, where, out = []) {
  if (Array.isArray(value)) value.forEach((v, i) => statusFields(v, `${where}[${i}]`, out));
  else if (value && typeof value === "object") {
    if ("status" in value) out.push({ where, field: value });
    for (const [k, v] of Object.entries(value)) statusFields(v, where ? `${where}.${k}` : k, out);
  }
  return out;
}

function strings(value, where, out = []) {
  if (typeof value === "string") out.push({ where, text: value });
  else if (Array.isArray(value)) value.forEach((v, i) => strings(v, `${where}[${i}]`, out));
  else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) strings(v, where ? `${where}.${k}` : k, out);
  return out;
}

function extraRules(cd, file, errors) {
  if (path.basename(file) !== `${cd.code}.json`) errors.push(`file name should be ${cd.code}.json`);

  const sources = new Map();
  for (const s of cd.sources || []) {
    if (sources.has(s.id)) errors.push(`sources: the id "${s.id}" is used twice`);
    sources.set(s.id, s);
  }
  for (const s of sources.values()) {
    if (s.read === false && s.via && !(sources.get(s.via) && sources.get(s.via).read)) {
      errors.push(`sources.${s.id}: "via" must be the id of a source that was read`);
    }
  }

  const used = new Set();
  for (const { where, field } of statusFields(cd, "")) {
    const ids = field.sources || [];
    for (const id of ids) {
      used.add(id);
      if (!sources.has(id)) errors.push(`${where}: source "${id}" is not in the sources list`);
    }
    // Verified means checked against a named source that was actually read.
    if (field.status === "verified" && !ids.some((id) => sources.get(id) && sources.get(id).read)) {
      errors.push(`${where}: status is verified but it names no source that was read (use draft, or add the source)`);
    }
  }
  for (const s of sources.values()) {
    const cited = [...sources.values()].some((o) => o.via === s.id) || used.has(s.id);
    if (!cited) errors.push(`sources.${s.id}: no field points to this source`);
  }

  if (cd.descriptor && cd.descriptor.status !== "verified") {
    errors.push("descriptor: the official wording must be verified against the VCAA site, not left as a draft");
  }
  if (cd.descriptor && cd.descriptor.url && !cd.descriptor.url.endsWith(`#${cd.code}`)) {
    errors.push(`descriptor.url: should end with #${cd.code}`);
  }

  // Science codes up to Level 6 must be real codes at the right band.
  const known = (code) => !/^VC2S(F|2|4|6)[UIH]/.test(code) || Boolean(curriculum[code]);
  const codeFields = [
    ...(cd.inquiry || []).map((r, i) => [`inquiry[${i}]`, r.code]),
    ...(cd.human_endeavour || []).map((r, i) => [`human_endeavour[${i}]`, r.code]),
    ...["below", "same", "above"].flatMap((k) => ((cd.related || {})[k] || []).map((r, i) => [`related.${k}[${i}]`, r.code])),
    ["code", cd.code],
  ];
  for (const [where, code] of codeFields) {
    if (code && !known(code)) errors.push(`${where}: ${code} is not in src/_data/curriculum.json`);
  }
  const mine = curriculum[cd.code];
  if (mine) {
    if (mine.sub !== cd.sub_strand) errors.push(`sub_strand: curriculum.json says "${mine.sub}"`);
    const band = cd.code.match(/^VC2S(F|[0-9]+)/)[1];
    for (const [i, r] of (cd.inquiry || []).entries()) {
      if (!r.code.startsWith(`VC2S${band}I`)) errors.push(`inquiry[${i}]: ${r.code} is not at the same band as ${cd.code}`);
    }
  }
  for (const key of ["below", "same", "above"]) {
    for (const [i, r] of ((cd.related || {})[key] || []).entries()) {
      if (!r.gap && !r.code) errors.push(`related.${key}[${i}]: needs a code (or gap: true when there is nothing to link to)`);
    }
  }

  // Lines on the map join codes that have a box on it.
  const onMap = new Set([cd.code, ...["below", "same", "above"].flatMap((k) => ((cd.related || {})[k] || []).map((r) => r.code))]);
  for (const [i, link] of ((cd.related || {}).links || []).entries()) {
    for (const end of ["from", "to"]) {
      if (!onMap.has(link[end])) errors.push(`related.links[${i}]: ${link[end]} is not a row in related`);
    }
    if (link.from === link.to) errors.push(`related.links[${i}]: joins ${link.from} to itself`);
  }
  if ((cd.related || {}).links) {
    for (const key of ["below", "same", "above"]) {
      for (const [i, r] of cd.related[key].entries()) {
        if (r.gap) continue;
        if (!r.label) errors.push(`related.${key}[${i}]: needs a label for its box on the map`);
        if (!/^VC2(S|TDE|TDI)[0-9]/.test(r.code || "")) errors.push(`related.${key}[${i}]: the map only has columns for Science, Design and Technologies and Digital Technologies`);
      }
    }
  }

  // House style: no em dashes, no en dashes, no spaced hyphen used as a dash.
  for (const { where, text } of strings(cd, "")) {
    if (/[\u2014\u2013]/.test(text)) errors.push(`${where}: has an em or en dash (rewrite the sentence, and use "to" for ranges)`);
    if (/\s-\s/.test(text)) errors.push(`${where}: has a spaced hyphen used as a dash`);
  }
}

// ---- Run ----

function summary(cd) {
  const fields = statusFields(cd, "");
  return {
    code: cd.code,
    title: cd.title,
    band: cd.band,
    sub_strand: cd.sub_strand,
    updated: cd.updated,
    verified: fields.filter((f) => f.field.status === "verified").length,
    draft: fields.filter((f) => f.field.status === "draft").length,
    unverified: (cd.unverified || []).length,
  };
}

const files = fs.existsSync(OBJECTS) ? fs.readdirSync(OBJECTS).filter((f) => f.endsWith(".json")).sort() : [];
let failed = 0;
const index = [];

for (const name of files) {
  const file = path.join(OBJECTS, name);
  const errors = [];
  let cd;
  try {
    cd = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.error(`FAIL ${name}\n  not valid JSON: ${e.message}`);
    failed++;
    continue;
  }
  validate(cd, schema, "", errors);
  // The extra rules assume the right shapes, so a badly shaped file may stop them early.
  try {
    extraRules(cd, file, errors);
  } catch (e) {
    if (!errors.length) errors.push(`could not finish checking: ${e.message}`);
  }
  if (errors.length) {
    failed++;
    console.error(`FAIL ${name}`);
    for (const e of errors) console.error(`  ${e.replace(/^: /, "").replace(/^\./, "")}`);
  } else {
    const s = summary(cd);
    index.push(s);
    console.log(`ok   ${name}: ${s.verified} verified, ${s.draft} draft, ${s.unverified} flagged as not checked`);
  }
}

if (!files.length) console.log("No CD objects in content/cd/objects/ yet.");

if (!failed) {
  const text = JSON.stringify({ note: "Written by npm run check-cd -- --write. Do not edit by hand.", objects: index }, null, 2) + "\n";
  const current = fs.existsSync(INDEX) ? fs.readFileSync(INDEX, "utf8") : "";
  if (WRITE) {
    if (text !== current) fs.writeFileSync(INDEX, text);
    console.log(text === current ? "index.json is already up to date." : "Wrote content/cd/index.json.");
  } else if (text !== current) {
    console.error("FAIL content/cd/index.json is out of date. Run: npm run check-cd -- --write");
    failed++;
  }
}

process.exit(failed ? 1 : 0);
