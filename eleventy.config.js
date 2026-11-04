import fs from "node:fs";
import path from "node:path";
import { HtmlBasePlugin } from "@11ty/eleventy";
import { vc2Url } from "./lib/vc2.js";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  // Published so the site can show the latest ticks without a GitHub key.
  eleventyConfig.addPassthroughCopy({ "content/progress.json": "progress.json" });
  // Plans in progress, so the Planning page can show them without a key.
  eleventyConfig.addPassthroughCopy({ "content/plans": "plans" });
  eleventyConfig.addWatchTarget("content/");

  // Link for a Victorian Curriculum 2.0 code (see lib/vc2.js).
  eleventyConfig.addFilter("vc2Url", vc2Url);
  // A code's short summary from src/_data/curriculum.json, for chip tooltips.
  const curriculum = JSON.parse(fs.readFileSync("src/_data/curriculum.json", "utf8")).codes;
  eleventyConfig.addFilter("vc2Summary", (code) => (curriculum[code] ? curriculum[code].summary : ""));

  // Data for a page script, safe inside <script type="application/json">.
  eleventyConfig.addFilter("jsonScript", (value) => JSON.stringify(value).replace(/</g, "\\u003c"));

  // Text in square brackets is a placeholder for content still to come.
  eleventyConfig.addFilter("isPlaceholder", (value) =>
    typeof value === "string" && value.trim().startsWith("[")
  );

  // Copy every non-Markdown file in content/units (PDFs, live artefacts,
  // images) to the same path under /units/ on the site.
  eleventyConfig.on("eleventy.after", ({ dir }) => {
    const from = path.join("content", "units");
    if (!fs.existsSync(from)) return;
    fs.cpSync(from, path.join(dir.output, "units"), {
      recursive: true,
      filter: (src) =>
        fs.statSync(src).isDirectory() || (!src.endsWith(".md") && !src.endsWith(".DS_Store")),
    });
  });
}

export const config = {
  dir: { input: "src", output: "_site" },
  pathPrefix: "/steam-hub/",
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
};
