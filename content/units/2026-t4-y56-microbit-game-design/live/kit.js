// Pictures and code blocks for micro:bit Game Design with Jacdac, shared by
// every artefact in this unit. Pictures are drawn in a 120 by 120 box with
// theme tokens (works in light and dark mode): PIC.microbit(), or
// picSvg("ring") for a whole <svg>. blockStack() draws MakeCode-style
// blocks, coloured by drawer, so code on the projector looks the same in
// every lesson.
const PIC = (() => {
  const O = 'stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const board = (hi = "") => {
    const glow = (on) => on ? 'fill="var(--solar-orange)"' : 'fill="var(--panel-2)"';
    let s = `<rect x="14" y="22" width="92" height="76" rx="10" fill="var(--violet)" ${O}/>`;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) s += `<rect x="${44 + c * 7}" y="${40 + r * 7}" width="4" height="4" fill="${hi === "display" && (r + c) % 2 === 0 ? "var(--solar-orange)" : "var(--paper)"}"/>`;
    s += `<circle cx="28" cy="60" r="7" ${glow(hi === "buttons")} ${O}/><circle cx="92" cy="60" r="7" ${glow(hi === "buttons")} ${O}/>`;
    s += `<ellipse cx="60" cy="30" rx="8" ry="4" ${glow(hi === "logo")} ${O}/>`;
    s += `<path d="M20 98 L20 104 M32 98 L32 104 M60 98 L60 104 M88 98 L88 104 M100 98 L100 104" ${O}/>`;
    if (hi === "speaker") s += `<path d="M104 30 q8 8 0 16 M110 26 q12 12 0 24" fill="none" stroke="var(--solar-orange)" stroke-width="4" stroke-linecap="round"/>`;
    if (hi === "shake") s += `<path d="M6 40 l-4 8 l4 8 M114 40 l4 8 l-4 8" fill="none" stroke="var(--plasma-pink)" stroke-width="4" stroke-linecap="round"/>`;
    return s;
  };
  const ringPx = (colours) => {
    let s = `<circle cx="60" cy="60" r="38" fill="none" stroke="var(--ink)" stroke-width="18"/><circle cx="60" cy="60" r="38" fill="none" stroke="var(--panel-2)" stroke-width="13"/>`;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      s += `<circle cx="${60 + 38 * Math.cos(a)}" cy="${60 + 38 * Math.sin(a)}" r="7" fill="${colours[i] || "var(--panel)"}" stroke="var(--ink)" stroke-width="2"/>`;
    }
    return s;
  };
  const all = (c) => Array(8).fill(c);
  return {
    microbit: () => board(),
    microbitButtons: () => board("buttons"),
    microbitLogo: () => board("logo"),
    microbitDisplay: () => board("display"),
    microbitSpeaker: () => board("speaker"),
    microbitShake: () => `<g transform="rotate(-12 60 60)">${board("shake")}</g>`,
    button: () => `<rect x="24" y="44" width="72" height="52" rx="8" fill="var(--panel-2)" ${O}/><rect x="40" y="26" width="40" height="30" rx="8" fill="var(--plasma-pink)" ${O}/><path d="M60 96 L60 110" stroke="var(--mist)" stroke-width="6"/>`,
    buttonBlue: () => `<rect x="24" y="44" width="72" height="52" rx="8" fill="var(--panel-2)" ${O}/><rect x="40" y="26" width="40" height="30" rx="8" fill="var(--volt-blue)" ${O}/><path d="M60 96 L60 110" stroke="var(--mist)" stroke-width="6"/>`,
    ring: () => ringPx([]),
    ringOn: () => ringPx(all("var(--violet)")),
    ringGreen: () => ringPx(all("var(--ion-cyan)")),
    ringRed: () => ringPx(all("var(--plasma-pink)")),
    ringRainbow: () => ringPx(["var(--plasma-pink)", "var(--solar-orange)", "var(--paper)", "var(--ion-cyan)", "var(--volt-blue)", "var(--violet)", "var(--plasma-pink)", "var(--solar-orange)"]),
    ringBar: () => ringPx(["var(--solar-orange)", "var(--solar-orange)", "var(--solar-orange)", "var(--solar-orange)", "var(--solar-orange)"]),
    jacdaptor: () => `<rect x="10" y="50" width="100" height="44" rx="8" fill="var(--panel-2)" ${O}/><rect x="22" y="36" width="76" height="22" rx="4" fill="var(--violet)" ${O}/>${[26, 50, 74].map((x) => `<rect x="${x}" y="82" width="20" height="12" rx="3" fill="var(--ink)"/>`).join("")}`,
    cable: () => `<path d="M14 70 C40 20 80 100 106 50" fill="none" stroke="var(--ink)" stroke-width="7" stroke-linecap="round"/><rect x="4" y="62" width="20" height="16" rx="4" fill="var(--mist)" ${O}/><rect x="96" y="42" width="20" height="16" rx="4" fill="var(--mist)" ${O}/>`,
    battery: () => `<rect x="20" y="34" width="80" height="52" rx="8" fill="var(--ink)" ${O}/><rect x="30" y="44" width="28" height="32" rx="4" fill="var(--solar-orange)"/><rect x="62" y="44" width="28" height="32" rx="4" fill="var(--solar-orange)"/><path d="M100 60 Q114 60 114 40" fill="none" stroke="var(--plasma-pink)" stroke-width="4"/>`,
    ipad: () => `<rect x="18" y="10" width="84" height="100" rx="10" fill="var(--ink)" ${O}/><rect x="25" y="18" width="70" height="84" rx="4" fill="var(--panel-2)"/><rect x="32" y="28" width="56" height="12" rx="3" fill="var(--violet)"/><rect x="32" y="46" width="56" height="12" rx="3" fill="var(--plasma-pink)"/><rect x="32" y="64" width="40" height="12" rx="3" fill="var(--volt-blue)"/>`,
    tray: () => `<path d="M10 50 L110 50 L100 96 L20 96 Z" fill="var(--volt-blue)" ${O}/><rect x="24" y="30" width="34" height="24" rx="4" fill="var(--violet)" ${O}/><circle cx="82" cy="40" r="14" fill="none" stroke="var(--ink)" stroke-width="6"/>`,
    variableBox: () => `<path d="M20 50 L60 30 L100 50 L60 70 Z" fill="var(--paper)" ${O}/><path d="M20 50 L20 92 L60 112 L60 70 Z" fill="var(--violet)" ${O}/><path d="M100 50 L100 92 L60 112 L60 70 Z" fill="var(--volt-blue)" ${O}/><text x="80" y="88" text-anchor="middle" font-size="22" font-weight="800" fill="var(--white)">7</text><text x="40" y="24" text-anchor="middle" font-size="16" font-weight="700" fill="var(--ink)">score</text>`,
    flag: () => `<rect x="14" y="40" width="92" height="40" rx="20" fill="var(--ion-cyan)" ${O}/><circle cx="86" cy="60" r="16" fill="var(--paper)" ${O}/><text x="44" y="67" text-anchor="middle" font-size="18" font-weight="800" fill="var(--void)">true</text>`,
    flagOff: () => `<rect x="14" y="40" width="92" height="40" rx="20" fill="var(--panel-2)" ${O}/><circle cx="34" cy="60" r="16" fill="var(--paper)" ${O}/><text x="76" y="67" text-anchor="middle" font-size="18" font-weight="800" fill="var(--ink)">false</text>`,
    bug: () => `<ellipse cx="60" cy="66" rx="26" ry="34" fill="var(--plasma-pink)" ${O}/><circle cx="60" cy="32" r="14" fill="var(--ink)"/>${[44, 64, 84].map((y) => `<path d="M34 ${y} L14 ${y - 8} M86 ${y} L106 ${y - 8}" ${O}/>`).join("")}<path d="M60 40 L60 100" ${O}/>`,
    scoreboard: () => `<rect x="10" y="26" width="100" height="68" rx="8" fill="var(--ink)" ${O}/><text x="60" y="76" text-anchor="middle" font-size="40" font-weight="800" fill="var(--solar-orange)">42</text>`,
    stopwatch: () => `<circle cx="60" cy="66" r="40" fill="var(--paper)" ${O}/><rect x="52" y="12" width="16" height="12" rx="3" fill="var(--ink)"/><path d="M60 66 L60 38" stroke="var(--plasma-pink)" stroke-width="5" stroke-linecap="round"/><path d="M60 66 L80 74" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>`,
    speech: () => `<path d="M14 24 L106 24 L106 78 L54 78 L32 100 L36 78 L14 78 Z" fill="var(--paper)" ${O}/>${[40, 52, 64].map((y, i) => `<path d="M28 ${y} L${92 - i * 18} ${y}" stroke="var(--mist)" stroke-width="5" stroke-linecap="round"/>`).join("")}`,
    eye: () => `<path d="M8 60 Q60 10 112 60 Q60 110 8 60 Z" fill="var(--paper)" ${O}/><circle cx="60" cy="60" r="20" fill="var(--volt-blue)" ${O}/><circle cx="60" cy="60" r="8" fill="var(--ink)"/>`,
    checklist: () => `<rect x="20" y="10" width="80" height="100" rx="8" fill="var(--paper)" ${O}/>${[34, 58, 82].map((y, i) => `<rect x="32" y="${y - 8}" width="16" height="16" rx="3" fill="${i < 2 ? "var(--ion-cyan)" : "var(--panel)"}" ${O}/><path d="M56 ${y} L88 ${y}" stroke="var(--mist)" stroke-width="5" stroke-linecap="round"/>`).join("")}`,
    panel: () => `<rect x="8" y="26" width="104" height="72" rx="6" fill="var(--solar-orange)" ${O}/><circle cx="34" cy="62" r="12" fill="var(--volt-blue)" ${O}/><circle cx="86" cy="62" r="12" fill="var(--plasma-pink)" ${O}/><circle cx="60" cy="46" r="12" fill="none" stroke="var(--ink)" stroke-width="5"/><text x="34" y="92" text-anchor="middle" font-size="11" font-weight="800" fill="var(--void)">START</text><text x="86" y="92" text-anchor="middle" font-size="11" font-weight="800" fill="var(--void)">HIT</text>`,
    plainButtons: () => `<rect x="8" y="40" width="104" height="44" rx="6" fill="var(--panel-2)" ${O}/><circle cx="38" cy="62" r="12" fill="var(--plasma-pink)" ${O}/><circle cx="82" cy="62" r="12" fill="var(--plasma-pink)" ${O}/><text x="60" y="30" text-anchor="middle" font-size="26" font-weight="800" fill="var(--ink)">?</text>`,
    gamepad: () => `<path d="M20 44 Q60 30 100 44 Q116 76 104 92 Q94 100 82 84 L38 84 Q26 100 16 92 Q4 76 20 44 Z" fill="var(--volt-blue)" ${O}/><path d="M34 58 L34 74 M26 66 L42 66" stroke="var(--paper)" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="60" r="5" fill="var(--plasma-pink)"/><circle cx="90" cy="70" r="5" fill="var(--solar-orange)"/>`,
    note: () => `<path d="M44 90 L44 26 L96 16 L96 80" fill="none" ${O}/><ellipse cx="34" cy="90" rx="12" ry="9" fill="var(--solar-orange)" ${O}/><ellipse cx="86" cy="80" rx="12" ry="9" fill="var(--solar-orange)" ${O}/>`,
    star: () => `<path d="M60 12 L72 46 L108 46 L78 68 L90 104 L60 82 L30 104 L42 68 L12 46 L48 46 Z" fill="var(--solar-orange)" ${O}/>`,
    sticky: () => `<rect x="14" y="16" width="56" height="56" fill="var(--ion-cyan)" ${O} transform="rotate(-6 42 44)"/><rect x="50" y="48" width="56" height="56" fill="var(--solar-orange)" ${O} transform="rotate(5 78 76)"/><text x="40" y="50" text-anchor="middle" font-size="12" font-weight="800" fill="var(--void)">keep</text><text x="78" y="82" text-anchor="middle" font-size="12" font-weight="800" fill="var(--void)">change</text>`,
    question: () => `<circle cx="60" cy="60" r="46" fill="var(--violet)" ${O}/><text x="60" y="80" text-anchor="middle" font-size="60" font-weight="800" fill="var(--white)">?</text>`,
  };
})();

const picSvg = (name, cls = "") => `<svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true">${PIC[name]()}</svg>`;

// MakeCode-style blocks. Drawer colours use the palette, so they match
// across the unit (not MakeCode's own colours): Basic blue, Input pink,
// Music orange, Variables violet, Logic cyan, Modules (Jacdac) ultraviolet.
const DRAWER = {
  basic: ["var(--volt-blue)", "var(--white)"],
  input: ["var(--plasma-pink)", "var(--void)"],
  music: ["var(--solar-orange)", "var(--void)"],
  variables: ["var(--violet)", "var(--white)"],
  logic: ["var(--ion-cyan)", "var(--void)"],
  modules: ["var(--ultraviolet)", "var(--void)"],
};
// rows: [[drawer, text, depth], ...]. Depth 0 is an event block; deeper
// rows sit inside it. visible: how many rows to show (for animation).
function blockStack(rows, x = 20, y = 20, visible = rows.length, highlight = -1) {
  const H = 34, G = 4, IND = 26;
  let s = "";
  rows.slice(0, visible).forEach(([drawer, text, depth], i) => {
    const [fill, ink] = DRAWER[drawer];
    const bx = x + depth * IND, by = y + i * (H + G);
    const w = Math.max(150, text.length * 10.5 + 26);
    s += `<rect x="${bx}" y="${by}" width="${w}" height="${H}" rx="${depth === 0 ? 10 : 6}" fill="${fill}" stroke="${i === highlight ? "var(--ink)" : "none"}" stroke-width="4"/>`;
    s += `<text x="${bx + 13}" y="${by + 23}" font-size="17" font-weight="700" fill="${ink}" font-family="var(--font)">${text}</text>`;
    if (depth > 0) {
      const parent = rows.slice(0, i).map((r, j) => [r, j]).reverse().find(([r]) => r[2] < depth);
      if (parent) s += `<rect x="${x + parent[0][2] * IND}" y="${by - G}" width="${IND - 4}" height="${H + G}" fill="${DRAWER[parent[0][0]][0]}"/>`;
    }
  });
  return s;
}
