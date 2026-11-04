// Checks a plan after a round of the plan-unit workflow, so a broken plan
// is never published. Run: node scripts/check-plan.mjs <plan id> <round>
// Prints every problem and exits with 1 if there are any.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const [id, round] = process.argv.slice(2);
const problems = [];
const fail = (msg) => problems.push(msg);
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

const planFile = path.join("content", "plans", `${id}.json`);
let plan;
try {
  plan = readJson(planFile);
} catch (e) {
  console.error(`${planFile}: ${e.message}`);
  process.exit(1);
}

const codes = readJson("src/_data/curriculum.json").codes;
const resources = readJson("src/_data/resources.json").resources;
const lenses = readJson("src/_data/lenses.json").nodes;
const CODE = /^VC2[A-Z0-9]{4,}$/;
const text = (v) => typeof v === "string" && v.trim().length > 0;

if (round === "directions") {
  const dirs = plan.directions;
  if (plan.status !== "directions") fail(`status should be "directions", not "${plan.status}"`);
  if (!Array.isArray(dirs) || dirs.length !== 3) fail("there should be exactly 3 directions");
  for (const d of dirs || []) {
    const at = `direction ${d.id}`;
    if (!["A", "B", "C"].includes(d.id)) fail(`${at}: id should be A, B or C`);
    for (const f of ["title", "type", "big_idea"]) if (!text(d[f])) fail(`${at}: ${f} is missing`);
    if (!d.lisc || !text(d.lisc.intention) || !/^To /.test(d.lisc.intention)) fail(`${at}: the Learning Intention should start "To"`);
    if (!d.lisc || !Array.isArray(d.lisc.criteria) || d.lisc.criteria.length < 2) fail(`${at}: needs Success Criteria`);
    if (!Array.isArray(d.assessment) || !d.assessment.length) fail(`${at}: needs assessment options`);
    if (!Array.isArray(d.arc) || d.arc.length !== plan.lesson_count) fail(`${at}: the arc should have ${plan.lesson_count} lessons`);
    (d.arc || []).forEach((l, i) => { if (l.number !== i + 1 || !text(l.title)) fail(`${at}: arc lesson ${i + 1} needs number ${i + 1} and a title`); });
    for (const r of d.resources || []) if (!resources[r.id]) fail(`${at}: unknown resource "${r.id}"`);
    for (const r of plan.answers.must_use || []) if (!(d.resources || []).some((x) => x.id === r)) fail(`${at}: does not use must-use resource "${r}"`);
    for (const r of plan.answers.cant_use || []) if ((d.resources || []).some((x) => x.id === r)) fail(`${at}: uses "${r}", which James ruled out`);
    for (const c of d.connections || []) if (!CODE.test(c.code)) fail(`${at}: "${c.code}" is not a curriculum code`);
    for (const p of d.pedagogy || []) {
      if (!lenses[p.id]) fail(`${at}: unknown pedagogy tag "${p.id}"`);
      if (!["focus", "present"].includes(p.level)) fail(`${at}: pedagogy "${p.id}" level should be focus or present`);
    }
    if (!Array.isArray(d.backbone) || !d.backbone.length) fail(`${at}: needs an evidence backbone`);
    if (!Array.isArray(d.flair) || !d.flair.length) fail(`${at}: needs flair`);
  }
} else if (round === "draft" || round === "revise") {
  if (plan.status !== "draft") fail(`status should be "draft", not "${plan.status}"`);
  const slug = plan.unit && plan.unit.slug;
  const unitFile = slug && path.join("content", "units", slug, "unit.md");
  if (!slug || !/^[0-9]{4}-t[1-4]-(f|y12|y34|y56)-[a-z0-9-]+$/.test(slug)) fail("plan.unit.slug is missing or badly named");
  else if (!fs.existsSync(unitFile)) fail(`${unitFile} does not exist`);
  else {
    const u = matter.read(unitFile).data;
    if (u.status !== "draft") fail("unit.md should have status: draft");
    if (u.plan !== id) fail(`unit.md should have plan: ${id}`);
    if (Number(u.lesson_count) !== Number(plan.lesson_count)) fail(`unit.md lesson_count should be ${plan.lesson_count}`);
    for (const c of plan.answers.targets || []) if (!(u.curriculum || []).includes(c)) fail(`unit.md is missing target ${c}`);
    for (const c of u.curriculum || []) if (/^VC2(TDE|TDI|S)[246][A-Z]/.test(c) && !codes[c]) fail(`unit.md has unknown code ${c}`);
    const outline = u.outline || [];
    if (outline.length !== Number(plan.lesson_count)) fail(`unit.md outline should have ${plan.lesson_count} lessons`);
    if (!u.lisc || !u.lisc.intention) fail("unit.md needs a LISC");
    if (!Array.isArray(u.assessment) || !u.assessment.length) fail("unit.md needs an assessment plan");
    if (!fs.existsSync(path.join("content", "units", slug, "reflections.md"))) fail("reflections.md is missing");
  }
} else {
  fail(`unknown round "${round}"`);
}

if (problems.length) {
  console.error(`Problems with plan ${id} (${round}):`);
  problems.forEach((p) => console.error(`  ${p}`));
  process.exit(1);
}
console.log(`Plan ${id} (${round}) looks right.`);
