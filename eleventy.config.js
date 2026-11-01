import fs from "node:fs";
import path from "node:path";
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(HtmlBasePlugin);
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addWatchTarget("content/");

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
