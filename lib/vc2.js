// Links Victorian Curriculum 2.0 content description codes (VC2S2U05,
// VC2TDE2C04, ...) to their place on the VCAA site. The curriculum page for
// each learning area scrolls to a code given after "#". Codes from a
// learning area not listed here go to the VCAA search, which finds any code.
const SITE = "https://f10.vcaa.vic.edu.au";
const AREAS = [
  ["VC2TDE", "technologies/design-and-technologies"],
  ["VC2TDI", "technologies/digital-technologies"],
  ["VC2S", "science"],
  ["VC2M", "mathematics"],
];

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
