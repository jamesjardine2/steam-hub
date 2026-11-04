// Links Victorian Curriculum 2.0 content description codes (VC2S2U05,
// VC2TDE2C04, VC2AMU2E01, ...) to their place on the VCAA site. The
// curriculum page for each learning area scrolls to a code given after "#".
// Codes from areas not listed here (languages, capabilities) go to the VCAA
// search, which finds any code. Longer prefixes come first so that, for
// example, VC2EAL is not read as VC2E. Paths checked on 2026-11-04.
const SITE = "https://f10.vcaa.vic.edu.au";
const AREAS = [
  ["VC2TDE", "technologies/design-and-technologies"],
  ["VC2TDI", "technologies/digital-technologies"],
  ["VC2EAL", "english/english-as-an-additional-language"],
  ["VC2E", "english/english"],
  ["VC2M", "mathematics"],
  ["VC2S", "science"],
  ["VC2HP", "health-and-physical-education"],
  ["VC2HC", "humanities/civics-and-citizenship"],
  ["VC2HE", "humanities/economics-and-business"],
  ["VC2HG", "humanities/geography"],
  ["VC2HH", "humanities/history"],
  ["VC2ADA", "the-arts/dance"],
  ["VC2ADR", "the-arts/drama"],
  ["VC2AMA", "the-arts/media-arts"],
  ["VC2AMU", "the-arts/music"],
  ["VC2AVA", "the-arts/visual-arts"],
  ["VC2AVC", "the-arts/visual-communication-design"],
];

// The learning area a code belongs to, for labels: "Music", "Science", ...
const LABELS = {
  VC2TDE: "Design and Technologies", VC2TDI: "Digital Technologies", VC2EAL: "EAL", VC2E: "English",
  VC2M: "Mathematics", VC2S: "Science", VC2HP: "Health and PE", VC2HC: "Civics and Citizenship",
  VC2HE: "Economics and Business", VC2HG: "Geography", VC2HH: "History", VC2ADA: "Dance",
  VC2ADR: "Drama", VC2AMA: "Media Arts", VC2AMU: "Music", VC2AVA: "Visual Arts",
  VC2AVC: "Visual Communication Design",
};

export function vc2Area(code) {
  const area = AREAS.find(([prefix]) => code.startsWith(prefix));
  return area ? LABELS[area[0]] : "";
}

export const VC2_CODE = /\bVC2[A-Z0-9]{4,}\b/g;

export function vc2Url(code) {
  const area = AREAS.find(([prefix]) => code.startsWith(prefix));
  return area
    ? `${SITE}/learning-areas/${area[1]}/curriculum#${code}`
    : `${SITE}/search?keys=${encodeURIComponent(code)}`;
}

// Turns every code in rendered HTML into a link, leaving tags, attributes
// and existing links alone.
export function linkVc2(html) {
  let inLink = 0;
  return html.split(/(<[^>]+>)/).map((part) => {
    if (part.startsWith("<")) {
      if (/^<a[\s>]/i.test(part)) inLink++;
      else if (/^<\/a>/i.test(part)) inLink = Math.max(0, inLink - 1);
      return part;
    }
    if (inLink) return part;
    return part.replace(VC2_CODE, (code) =>
      `<a class="vc2" href="${vc2Url(code)}" target="_blank" rel="noopener" title="Open ${code} in the Victorian Curriculum">${code}</a>`);
  }).join("");
}
