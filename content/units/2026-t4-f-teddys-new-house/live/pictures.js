// Pictures for Teddy's New House, shared by every artefact in this unit so
// a caravan or a fridge looks the same on the slides, word walls and
// how-to pages. Each picture is drawn in a 120 by 120 box with theme tokens,
// so it works in light and dark mode. Use: PIC.house() inside an <svg
// viewBox="0 0 120 120">, or picSvg("house") for a whole <svg>.
const PIC = (() => {
  const O = 'stroke="var(--ink)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const win = (x, y, w = 14, h = 14) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--ion-cyan)" ${O}/>`;
  const wheel = (x, y, r = 8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--ink)"/><circle cx="${x}" cy="${y}" r="${r / 3}" fill="var(--panel)"/>`;
  const bear = (mood) => `
    <circle cx="34" cy="30" r="14" fill="var(--solar-orange)" ${O}/><circle cx="86" cy="30" r="14" fill="var(--solar-orange)" ${O}/>
    <circle cx="60" cy="64" r="42" fill="var(--solar-orange)" ${O}/>
    <circle cx="45" cy="56" r="5" fill="var(--ink)"/><circle cx="75" cy="56" r="5" fill="var(--ink)"/>
    <ellipse cx="60" cy="80" rx="18" ry="14" fill="var(--paper)" ${O}/><circle cx="60" cy="74" r="5" fill="var(--ink)"/>
    ${mood === "sad" ? `<path d="M50 90 Q60 82 70 90" fill="none" ${O}/>` : `<path d="M50 84 Q60 94 70 84" fill="none" ${O}/>`}`;
  const bricks = (rows, cols, overlap, x0 = 18, y0 = 24, bw = 28, bh = 14, colour = "var(--plasma-pink)") => {
    let s = "";
    for (let r = 0; r < rows; r++) {
      const shift = overlap && r % 2 ? bw / 2 : 0;
      for (let c = 0; c < cols; c++) {
        let x = x0 + c * bw - shift, w = bw;
        if (overlap && r % 2 && c === 0) { x = x0; w = bw / 2; }
        s += `<rect x="${x}" y="${y0 + (rows - 1 - r) * bh}" width="${w}" height="${bh}" fill="${colour}" ${O}/>`;
        if (overlap && r % 2 && c === cols - 1) s += `<rect x="${x0 + cols * bw - bw / 2}" y="${y0 + (rows - 1 - r) * bh}" width="${bw / 2}" height="${bh}" fill="${colour}" ${O}/>`;
      }
    }
    return s;
  };
  return {
    // Lesson 1: homes and not-homes
    house: () => `<rect x="26" y="56" width="68" height="50" fill="var(--paper)" ${O}/><path d="M18 58 L60 20 L102 58 Z" fill="var(--solar-orange)" ${O}/><rect x="52" y="78" width="16" height="28" fill="var(--violet)" ${O}/>${win(34, 66)}${win(72, 66)}`,
    apartment: () => {
      let s = `<rect x="30" y="10" width="60" height="100" fill="var(--volt-blue)" ${O}/>`;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) s += `<rect x="${38 + c * 16}" y="${18 + r * 20}" width="10" height="12" fill="var(--ion-cyan)" ${O}/>`;
      return s + `<rect x="52" y="94" width="16" height="16" fill="var(--paper)" ${O}/>`;
    },
    caravan: () => `<rect x="14" y="36" width="80" height="54" rx="14" fill="var(--paper)" ${O}/>${win(26, 48, 26, 18)}<rect x="62" y="50" width="20" height="40" fill="var(--violet)" ${O}/><path d="M94 80 L110 80" ${O}/>${wheel(40, 92, 10)}`,
    tent: () => `<path d="M10 100 L60 20 L110 100 Z" fill="var(--solar-orange)" ${O}/><path d="M48 100 L60 62 L72 100 Z" fill="var(--panel)" ${O}/><path d="M60 20 L60 10" ${O}/>`,
    stilts: () => `<path d="M6 104 q8 -6 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0" fill="none" stroke="var(--ion-cyan)" stroke-width="4"/>${[34, 50, 70, 86].map((x) => `<path d="M${x} 66 L${x} 106" ${O}/>`).join("")}<rect x="26" y="40" width="68" height="28" fill="var(--paper)" ${O}/><path d="M20 42 L60 14 L100 42 Z" fill="var(--solar-orange)" ${O}/>${win(54, 46, 12, 12)}`,
    school: () => `<rect x="14" y="44" width="92" height="62" fill="var(--paper)" ${O}/><path d="M10 46 L60 22 L110 46 Z" fill="var(--volt-blue)" ${O}/><circle cx="60" cy="38" r="6" fill="var(--paper)" ${O}/><path d="M60 22 L60 4" ${O}/><path d="M60 4 L78 9 L60 14 Z" fill="var(--plasma-pink)" ${O}/>${win(22, 56)}${win(84, 56)}${win(22, 82)}${win(84, 82)}<rect x="48" y="74" width="24" height="32" fill="var(--violet)" ${O}/>`,
    supermarket: () => `<rect x="12" y="44" width="96" height="62" fill="var(--paper)" ${O}/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${12 + i * 16}" y="30" width="16" height="16" fill="${i % 2 ? "var(--paper)" : "var(--plasma-pink)"}" ${O}/>`).join("")}<rect x="22" y="58" width="40" height="30" fill="var(--ion-cyan)" ${O}/><path d="M74 66 L80 66 L86 84 L102 84 L106 70 L82 70" fill="none" ${O}/>${wheel(88, 92, 4)}${wheel(100, 92, 4)}`,
    bus: () => `<rect x="8" y="34" width="104" height="58" rx="10" fill="var(--solar-orange)" ${O}/>${[16, 38, 60].map((x) => win(x, 44, 18, 18)).join("")}<rect x="84" y="44" width="20" height="46" fill="var(--ion-cyan)" ${O}/>${wheel(32, 94, 10)}${wheel(88, 94, 10)}`,
    playground: () => `<path d="M14 106 L30 40 L46 106" fill="none" ${O}/><path d="M30 40 L46 40 L46 50" fill="none" ${O}/><path d="M46 50 Q70 60 82 106" fill="none" stroke="var(--plasma-pink)" stroke-width="8" stroke-linecap="round"/><path d="M84 20 L84 106 M110 20 L110 106 M80 20 L114 20" fill="none" ${O}/><path d="M92 20 L92 80 M102 20 L102 80" ${O}/><rect x="88" y="78" width="18" height="6" fill="var(--volt-blue)" ${O}/>`,
    rain: () => `<path d="M24 56 q0 -22 22 -22 q8 -18 28 -12 q20 0 22 18 q16 2 14 16 Z" fill="var(--mist)" ${O}/>${[30, 50, 70, 90].map((x, i) => `<path d="M${x} ${70 + (i % 2) * 8} l-6 14" stroke="var(--ion-cyan)" stroke-width="5" stroke-linecap="round"/>`).join("")}`,
    puddle: () => `<ellipse cx="60" cy="84" rx="48" ry="16" fill="var(--ion-cyan)" ${O}/><path d="M40 40 l-4 12 M60 30 l-4 12 M80 40 l-4 12" stroke="var(--ion-cyan)" stroke-width="5" stroke-linecap="round"/>`,
    umbrella: () => `<path d="M14 60 Q60 6 106 60 Z" fill="var(--plasma-pink)" ${O}/><path d="M60 60 L60 100 q0 10 -10 10 q-8 0 -8 -8" fill="none" ${O}/>${[30, 50, 70, 90].map((x) => `<path d="M${x} 10 l-4 10" stroke="var(--ion-cyan)" stroke-width="4" stroke-linecap="round"/>`).join("")}`,
    towel: () => `<path d="M30 16 L90 16 L90 104 L30 104 Z" fill="var(--volt-blue)" ${O}/><path d="M30 86 L90 86 M30 94 L90 94" stroke="var(--paper)" stroke-width="4"/><path d="M22 16 L98 16" ${O}/>`,
    bed: () => `<rect x="10" y="60" width="100" height="26" fill="var(--violet)" ${O}/><rect x="10" y="36" width="10" height="66" fill="var(--paper)" ${O}/><rect x="18" y="48" width="30" height="14" rx="6" fill="var(--paper)" ${O}/><path d="M104 86 L104 102" ${O}/>`,
    pillow: () => `<path d="M14 40 Q60 26 106 40 Q114 60 106 80 Q60 94 14 80 Q6 60 14 40 Z" fill="var(--paper)" ${O}/>`,
    couch: () => `<rect x="10" y="50" width="100" height="36" rx="10" fill="var(--volt-blue)" ${O}/><rect x="22" y="34" width="76" height="26" rx="8" fill="var(--volt-blue)" ${O}/><rect x="4" y="54" width="18" height="34" rx="6" fill="var(--volt-blue)" ${O}/><rect x="98" y="54" width="18" height="34" rx="6" fill="var(--volt-blue)" ${O}/>`,
    rock: () => `<path d="M14 92 L28 50 L58 34 L92 44 L108 92 Z" fill="var(--mist)" ${O}/>`,
    cactus: () => `<rect x="48" y="16" width="24" height="90" rx="12" fill="var(--solar-orange)" ${O}/><path d="M48 60 L32 60 L32 40" fill="none" stroke="var(--solar-orange)" stroke-width="10" stroke-linecap="round"/><path d="M72 50 L88 50 L88 32" fill="none" stroke="var(--solar-orange)" stroke-width="10" stroke-linecap="round"/>${[[56, 30], [64, 50], [56, 70], [64, 88]].map(([x, y]) => `<path d="M${x} ${y} l-6 -4 M${x + 4} ${y} l6 -4" ${O}/>`).join("")}`,
    // Lesson 2: things around a home
    fridge: () => `<rect x="30" y="8" width="60" height="104" rx="6" fill="var(--paper)" ${O}/><path d="M30 46 L90 46" ${O}/><path d="M80 22 L80 36 M80 58 L80 80" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>`,
    stove: () => `<rect x="20" y="40" width="80" height="70" fill="var(--paper)" ${O}/><rect x="32" y="64" width="56" height="34" fill="var(--panel)" ${O}/><rect x="20" y="30" width="80" height="10" fill="var(--mist)" ${O}/>${[38, 82].map((x) => `<ellipse cx="${x}" cy="30" rx="12" ry="3" fill="var(--plasma-pink)"/>`).join("")}<path d="M50 20 q4 -8 0 -14 M60 22 q4 -8 0 -14" fill="none" stroke="var(--mist)" stroke-width="3"/>`,
    kettle: () => `<path d="M30 104 L36 44 L84 44 L90 104 Z" fill="var(--volt-blue)" ${O}/><path d="M36 54 L18 40" stroke="var(--volt-blue)" stroke-width="8" stroke-linecap="round"/><path d="M84 54 q20 6 4 34" fill="none" ${O}/><path d="M44 44 q16 -18 32 0" fill="none" ${O}/><path d="M58 30 q4 -8 0 -16" fill="none" stroke="var(--mist)" stroke-width="3"/>`,
    toaster: () => `<rect x="18" y="50" width="84" height="56" rx="14" fill="var(--mist)" ${O}/><rect x="36" y="30" width="20" height="26" rx="4" fill="var(--solar-orange)" ${O}/><rect x="64" y="30" width="20" height="26" rx="4" fill="var(--solar-orange)" ${O}/><path d="M102 70 L110 70" ${O}/>`,
    wardrobe: () => `<rect x="24" y="8" width="72" height="100" fill="var(--solar-orange)" ${O}/><path d="M60 8 L60 108" ${O}/><circle cx="54" cy="58" r="3" fill="var(--ink)"/><circle cx="66" cy="58" r="3" fill="var(--ink)"/><path d="M28 108 L28 114 M92 108 L92 114" ${O}/>`,
    pyjamas: () => `<path d="M30 24 L48 16 Q60 26 72 16 L90 24 L104 46 L90 54 L86 44 L86 104 L34 104 L34 44 L30 54 L16 46 Z" fill="var(--plasma-pink)" ${O}/>${[[46, 40], [70, 62], [50, 80], [74, 92]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="var(--paper)"/>`).join("")}`,
    lamp: () => `<path d="M34 50 L46 14 L74 14 L86 50 Z" fill="var(--solar-orange)" ${O}/><path d="M60 50 L60 96" ${O}/><rect x="36" y="96" width="48" height="12" rx="4" fill="var(--violet)" ${O}/>`,
    toilet: () => `<rect x="70" y="14" width="30" height="46" rx="4" fill="var(--paper)" ${O}/><path d="M16 56 L84 56 Q84 84 60 88 L60 106 L36 106 L36 88 Q16 82 16 56 Z" fill="var(--paper)" ${O}/><ellipse cx="50" cy="56" rx="34" ry="6" fill="var(--ion-cyan)" ${O}/>`,
    bathtub: () => `<path d="M8 56 L112 56 L104 92 Q100 100 90 100 L30 100 Q20 100 16 92 Z" fill="var(--paper)" ${O}/><path d="M14 56 L106 56 L104 64 L16 64 Z" fill="var(--ion-cyan)"/><path d="M24 100 L20 110 M96 100 L100 110" ${O}/><path d="M22 56 L22 28 Q22 18 32 18 L40 18 L40 26" fill="none" ${O}/>${[50, 64, 78].map((x) => `<circle cx="${x}" cy="48" r="6" fill="var(--paper)" ${O}/>`).join("")}`,
    toothbrush: () => `<g transform="rotate(-35 60 60)"><rect x="14" y="54" width="70" height="12" rx="6" fill="var(--volt-blue)" ${O}/><rect x="80" y="50" width="26" height="14" rx="3" fill="var(--paper)" ${O}/>${[84, 90, 96, 102].map((x) => `<path d="M${x} 50 L${x} 40" ${O}/>`).join("")}</g><rect x="44" y="90" width="62" height="18" rx="6" fill="var(--paper)" ${O}/><rect x="44" y="90" width="16" height="18" fill="var(--plasma-pink)" ${O}/>`,
    shower: () => `<path d="M20 110 L20 20 Q20 10 30 10 L70 10 L70 26" fill="none" ${O}/><path d="M52 26 L88 26 L80 40 L60 40 Z" fill="var(--mist)" ${O}/>${[60, 70, 80].map((x, i) => `<path d="M${x} 50 l${(i - 1) * 4} 14 M${x} 74 l${(i - 1) * 5} 14" stroke="var(--ion-cyan)" stroke-width="4" stroke-linecap="round"/>`).join("")}`,
    // Lesson 3: walls and Teddy
    teddySad: () => bear("sad"),
    teddyHappy: () => bear("happy"),
    wallTowers: () => bricks(5, 3, false, 18, 28, 28, 14) + [0, 1].map((i) => `<path d="M${46 + i * 28} 28 L${46 + i * 28} 98" stroke="var(--panel)" stroke-width="4"/>`).join(""),
    wallOverlap: () => bricks(5, 3, true, 18, 28, 28, 14, "var(--volt-blue)"),
    brickHouse: () => `${bricks(4, 3, true, 18, 52, 28, 13, "var(--plasma-pink)")}<path d="M12 54 L60 18 L108 54 Z" fill="var(--solar-orange)" ${O}/><rect x="50" y="78" width="20" height="26" fill="var(--violet)" ${O}/>`,
    tower: () => `${[0, 1, 2, 3, 4, 5].map((r) => `<rect x="46" y="${18 + r * 14}" width="28" height="14" fill="var(--plasma-pink)" ${O}/>`).join("")}`,
    cardHouse: () => `<path d="M20 104 L36 64 L52 104 M52 104 L68 64 L84 104 M84 104 L100 64" fill="none" stroke="var(--solar-orange)" stroke-width="5" stroke-linecap="round"/><path d="M30 62 L106 62" stroke="var(--solar-orange)" stroke-width="5"/><path d="M38 62 L54 22 L70 62 M70 62 L86 22" fill="none" stroke="var(--solar-orange)" stroke-width="5" stroke-linecap="round"/>`,
    tree: () => `<rect x="50" y="62" width="20" height="46" fill="var(--solar-orange)" ${O}/><circle cx="60" cy="44" r="34" fill="var(--volt-blue)" ${O}/>`,
    door: () => `<rect x="34" y="10" width="52" height="100" fill="var(--violet)" ${O}/><circle cx="76" cy="62" r="4" fill="var(--paper)"/>`,
    window: () => `<rect x="20" y="20" width="80" height="80" fill="var(--ion-cyan)" ${O}/><path d="M60 20 L60 100 M20 60 L100 60" ${O}/>`,
    roof: () => `<path d="M10 82 L60 26 L110 82 Z" fill="var(--solar-orange)" ${O}/><path d="M28 82 L28 104 M92 82 L92 104" stroke="var(--mist)" stroke-width="4"/>`,
    basePlate: () => {
      let s = `<rect x="8" y="30" width="104" height="60" rx="4" fill="var(--volt-blue)" ${O}/>`;
      for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) s += `<circle cx="${18 + c * 12}" cy="${42 + r * 12}" r="3" fill="var(--paper)" opacity="0.6"/>`;
      return s;
    },
    // Lesson 4: the water test
    paper: () => `<path d="M26 10 L84 10 L100 26 L100 110 L26 110 Z" fill="var(--paper)" ${O}/><path d="M84 10 L84 26 L100 26" fill="none" ${O}/><path d="M38 48 L88 48 M38 64 L88 64 M38 80 L74 80" stroke="var(--mist)" stroke-width="4" stroke-linecap="round"/>`,
    foil: () => `<path d="M18 30 L52 18 L100 28 L106 70 L92 104 L48 108 L16 90 Z" fill="var(--mist)" ${O}/><path d="M18 30 L52 60 L100 28 M52 60 L48 108 M52 60 L106 70 M52 60 L16 90" fill="none" stroke="var(--paper)" stroke-width="3" stroke-linejoin="round"/>`,
    plastic: () => `<rect x="20" y="24" width="80" height="72" rx="8" fill="var(--panel-2)" ${O}/><path d="M34 42 L58 42 M34 54 L46 54" stroke="var(--paper)" stroke-width="5" stroke-linecap="round"/>`,
    cloth: () => `<rect x="20" y="24" width="80" height="72" fill="var(--plasma-pink)" ${O}/>${[40, 60, 80].map((p) => `<path d="M${p} 24 L${p} 96 M20 ${p + 4} L100 ${p + 4}" stroke="var(--paper)" stroke-width="3" stroke-dasharray="6 6" opacity="0.7"/>`).join("")}`,
    dropper: () => `<path d="M52 18 Q60 6 68 18 L68 44 L52 44 Z" fill="var(--plasma-pink)" ${O}/><rect x="48" y="44" width="24" height="10" fill="var(--paper)" ${O}/><path d="M54 54 L54 84 L60 98 L66 84 L66 54 Z" fill="var(--paper)" ${O}/><path d="M60 102 q-8 10 0 14 q8 -4 0 -14 Z" fill="var(--ion-cyan)" ${O}/>`,
  };
})();

const picSvg = (name, cls = "") => `<svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true">${PIC[name]()}</svg>`;
