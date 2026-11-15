// Draws a CD object (a curriculum fact sheet) from objects/<CODE>.json, or
// the list of all fact sheets when the address has no ?code=. Plain
// JavaScript, no libraries. The format is described in README.md and
// cd.schema.json in this folder.
(() => {
  const root = document.getElementById("cd-root");
  const code = new URLSearchParams(location.search).get("code");
  const VCAA = "https://f10.vcaa.vic.edu.au";
  const AREAS = [
    ["VC2TDE", "technologies/design-and-technologies"],
    ["VC2TDI", "technologies/digital-technologies"],
    ["VC2S", "science"],
  ];

  // h("p", { class: "small" }, "text", node, ...) builds an element. Text is
  // always added as text, never as HTML.
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  }

  const vcaaUrl = (c) => {
    const area = AREAS.find(([prefix]) => c.startsWith(prefix));
    return area ? `${VCAA}/learning-areas/${area[1]}/curriculum#${c}` : `${VCAA}/search?keys=${encodeURIComponent(c)}`;
  };
  const codeLink = (c) =>
    h("a", { class: "vc2", href: vcaaUrl(c), target: "_blank", rel: "noopener", title: `Open ${c} in the Victorian Curriculum` }, c);

  // Text with any curriculum code in it turned into a link to the VCAA site.
  function text(value) {
    const parts = String(value).split(/\b(VC2[A-Z0-9]{4,})\b/);
    return parts.map((part, i) => (i % 2 ? codeLink(part) : part));
  }

  const niceDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" });

  async function getJson(url, optional) {
    try {
      const res = await fetch(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`${res.status}`);
      return await res.json();
    } catch (e) {
      if (optional) return null;
      throw e;
    }
  }

  // ---- Pieces shared by every section ----

  let sourceNumbers = new Map();


  // [1] [3]: links to the numbered sources at the bottom of the page.
  function refs(ids) {
    if (!ids || !ids.length) return null;
    return h("span", { class: "cd-refs" }, "Sources ", ids.map((id) =>
      h("a", { href: `#source-${id}`, "data-source": id, title: "Show this source" }, `[${sourceNumbers.get(id)}]`)));
  }

  const head = (field, title, level = "h3") =>
    h("div", { class: "cd-head" }, title ? h(level, {}, text(title)) : null, refs(field.sources));


  const label = (words) => h("span", { class: "cd-label" }, words);
  const list = (lines) => h("ul", { class: "cd-list" }, lines.map((line) => h("li", {}, text(line))));


  function section(title, fields, body, open) {
    return h("details", { class: "acc", open: Boolean(open) },
      h("summary", {}, h("span", { class: "acc-title" }, title)),
      h("div", { class: "acc-body" }, body));
  }

  const items = (rows) => h("div", { class: "cd-items" }, rows);

  // ---- The ten fields ----

  function official(cd) {
    const d = cd.descriptor;
    return h("section", { class: "card cd-official" },
      head(d, "Official description", "h2"),
      h("p", { class: "cd-stem" }, d.stem),
      h("blockquote", { class: "cd-quote" }, d.text),
      h("p", {}, h("a", { href: d.url, target: "_blank", rel: "noopener" }, `Open ${cd.code} on the VCAA site`)),
      h("p", { class: "cd-attrib" }, d.attribution));
  }

  function paraphrase(cd) {
    const p = cd.paraphrase;
    return section("What it is really asking", [p], [
      head(p),
      h("p", { class: "cd-prose" }, text(p.text)),
      label("The ideas inside it"), list(p.asks_for),
      p.not_asking && p.not_asking.length ? [label("Not part of this description"), list(p.not_asking)] : null,
    ], true);
  }

  function keyQuestions(cd) {
    return section("Key questions", cd.key_questions, items(cd.key_questions.map((q) =>
      h("div", { class: "cd-item" },
        head(q, q.question),
        h("div", { class: "cd-cols" },
          h("div", {}, label("Know"), list(q.know)),
          h("div", {}, label("Understand"), list(q.understand)),
          h("div", {}, label("Do"), list(q.do)))))));
  }

  // Field 11: what competence looks like, quick checks, and what to do for
  // students who already have it or who are below the level.
  function assessment(cd) {
    const a = cd.assessment;
    if (!a) return null;
    const block = (name, field, lines) => h("div", { class: "cd-item" }, head(field, name), list(lines));
    return section("Assessment and differentiation", [a.can_do, ...a.quick_checks, a.extend, a.support], items([
      block("A student who has this can", a.can_do, a.can_do.items),
      h("div", { class: "cd-item" },
        h("h3", {}, "Quick checks"),
        a.quick_checks.map((q) => h("div", { class: "cd-quick" },
          head(q, q.title, "h4"),
          h("p", {}, text(q.how)),
          label("Look for"), h("p", {}, text(q.look_for))))),
      block("For students who already have it", a.extend, a.extend.items),
      h("div", { class: "cd-item" },
        head(a.support, "For students below the level"),
        list(a.support.below),
        label("Well below the level"), list(a.support.well_below)),
    ]));
  }

  function vocabulary(cd) {
    const v = cd.vocabulary;
    const tier = (name, words) =>
      h("div", {}, label(name), h("ul", { class: "cd-words" }, words.map((w) =>
        h("li", { class: w.in_descriptor ? "in-desc" : null },
          h("span", { class: "term" }, w.term),
          w.meaning ? h("span", { class: "meaning" }, w.meaning) : null))));
    return section("Vocabulary", [v], [
      head(v),
      h("div", { class: "cd-cols" }, tier("Everyday", v.everyday), tier("Academic", v.academic), tier("Science-specific", v.science)),
      h("p", { class: "cd-check" }, "Words in violet are in the official description."),
    ]);
  }

  function misconceptions(cd) {
    return section("Common misconceptions", cd.misconceptions, items(cd.misconceptions.map((m) =>
      h("div", { class: "cd-item" },
        head(m, m.idea),
        label("The science"), h("p", {}, text(m.science)),
        m.respond ? [label("Bring it out"), h("p", {}, text(m.respond))] : null,
        m.research && m.research.length
          ? [label("Studies named by the source"), h("p", { class: "small muted" }, m.research.join("; "))]
          : null))));
  }

  const codeRow = (field, chipCode, lead, body, extra) =>
    h("div", { class: "cd-item" },
      h("div", { class: "cd-row" },
        chipCode
          ? h("a", { class: "chip", href: vcaaUrl(chipCode), target: "_blank", rel: "noopener", title: `Open ${chipCode} in the Victorian Curriculum` }, chipCode)
          : null,
        h("div", { class: "cd-row-text" },
          lead ? h("p", { class: "strong" }, lead) : null,
          h("p", {}, text(body)),
          extra),
        refs(field.sources)));

  function inquiry(cd) {
    return section("Science Inquiry skills", cd.inquiry, items(cd.inquiry.map((r) => codeRow(r, r.code, r.skill, r.how))));
  }

  function humanEndeavour(cd) {
    return section("Science as a Human Endeavour", cd.human_endeavour, items(cd.human_endeavour.map((r) =>
      codeRow(r, r.code, r.first_nations ? h("span", { class: "cd-tag" }, "First Nations science") : null, r.hook))));
  }

  function related(cd, index) {
    const sheets = new Set(index.map((o) => o.code));
    const group = (name, rows) => [
      h("p", { class: "cd-group" }, name),
      items(rows.map((r) => codeRow(r, r.gap ? null : r.code, r.gap ? "Nothing to link" : r.band, r.summary,
        r.code && sheets.has(r.code) ? h("p", { class: "small" }, h("a", { href: `?code=${r.code}` }, "Open its fact sheet")) : null))),
    ];
    const all = [...cd.related.below, ...cd.related.same, ...cd.related.above];
    const rows = [
      group("Levels below", cd.related.below),
      group("Same level", cd.related.same),
      group("Levels above", cd.related.above),
    ];
    // With links in the file, the rows are drawn as a map and the written
    // reasons (with their status and sources) fold away underneath.
    if (!cd.related.links) return section("Related content descriptions", all, rows);
    return section("Related content descriptions", all, [
      relatedMap(cd, all),
      h("details", { class: "cd-why" }, h("summary", {}, "Why each one is linked"), rows),
    ]);
  }

  // ---- The map of related content descriptions ----
  // Levels run down the side (lowest at the top) and each learning area has a
  // column. Every box opens its content description on the VCAA site.

  const MAP_AREAS = [["VC2S", "Science"], ["VC2TDE", "Design and Technologies"], ["VC2TDI", "Digital Technologies"]];
  const MAP_LEVELS = { F: "Foundation to Level 2", 2: "Foundation to Level 2", 4: "Levels 3 and 4", 6: "Levels 5 and 6", 8: "Levels 7 and 8", 10: "Levels 9 and 10" };
  const SVG = "http://www.w3.org/2000/svg";

  function s(tag, attrs, ...kids) {
    const el = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
    el.append(...kids);
    return el;
  }

  // Where a code sits: its column (learning area) and its level.
  function place(c) {
    const m = c.match(/^(VC2TDE|VC2TDI|VC2S)(F|\d+)/);
    if (!m) return null;
    return { col: MAP_AREAS.findIndex(([prefix]) => prefix === m[1]), level: m[2] === "F" ? 2 : Number(m[2]) };
  }

  function relatedMap(cd, rows) {
    const nodes = [
      { code: cd.code, label: cd.title, summary: "This fact sheet.", focus: true },
      ...rows.filter((r) => !r.gap && r.code && place(r.code)),
    ].map((n) => ({ ...n, ...place(n.code) }));
    const levels = nodes.map((n) => n.level);
    const boxes = new Map();

    const box = (n) => {
      const el = h("a", {
        class: `cd-node${n.focus ? " is-focus" : ""}`,
        href: vcaaUrl(n.code), target: "_blank", rel: "noopener",
        title: n.summary,
      }, h("span", { class: "cd-node-code" }, n.code), h("span", { class: "cd-node-label" }, n.label || n.code));
      boxes.set(n.code, { el, ...n });
      return el;
    };

    const bands = [];
    // Lowest level at the top. Each cell is filled in reverse, so this fact
    // sheet's own box sits at the bottom of its cell, next to the level below.
    for (let level = Math.min(...levels); level <= Math.max(...levels); level += 2) {
      bands.push(h("div", { class: "cd-map-row", "data-level": level },
        h("div", { class: "cd-map-level" }, MAP_LEVELS[level]),
        MAP_AREAS.map((_, col) => h("div", { class: "cd-map-cell" },
          nodes.filter((n) => n.level === level && n.col === col).reverse().map(box)))));
    }

    const lines = s("svg", { class: "cd-map-lines", "aria-hidden": "true" });
    const map = h("div", { class: "cd-map" },
      h("div", { class: "cd-map-row cd-map-heads" }, h("div", {}), MAP_AREAS.map(([, name]) => h("div", { class: "cd-map-head" }, name))),
      bands, lines);

    // The lines are measured from the boxes, so they are drawn again whenever
    // the map changes size (which includes the section being opened).
    const draw = () => drawLinks(map, lines, boxes, cd.related.links);
    new ResizeObserver(draw).observe(map);

    const key = (kind, words) => h("span", { class: "cd-map-key" },
      s("svg", { class: "cd-map-lines", width: 34, height: 10, viewBox: "0 0 34 10", "aria-hidden": "true" },
        s("path", { class: `cd-link is-${kind}`, d: kind === "leads" ? "M1 5H26" : "M1 5H33" }),
        kind === "leads" ? s("path", { class: "cd-arrow", d: "M25 1L33 5L25 9Z" }) : ""),
      words);

    return h("div", { class: "cd-map-wrap" },
      h("div", { class: "cd-map-scroll" }, map),
      h("p", { class: "cd-map-legend" },
        key("leads", "Leads to"), key("connects", "Connects"), key("loose", "Loose link")));
  }

  // A path through corner points, with the corners rounded.
  function rounded(points, radius = 8) {
    let d = `M${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length - 1; i++) {
      const [a, b, c] = [points[i - 1], points[i], points[i + 1]];
      const r = Math.min(radius, Math.hypot(b.x - a.x, b.y - a.y) / 2, Math.hypot(c.x - b.x, c.y - b.y) / 2);
      const toward = (p) => { const len = Math.hypot(p.x - b.x, p.y - b.y) || 1; return { x: b.x + ((p.x - b.x) / len) * r, y: b.y + ((p.y - b.y) / len) * r }; };
      const [p, q] = [toward(a), toward(c)];
      d += ` L${p.x} ${p.y} Q${b.x} ${b.y} ${q.x} ${q.y}`;
    }
    const end = points[points.length - 1];
    return `${d} L${end.x} ${end.y}`;
  }

  function drawLinks(map, svg, boxes, links) {
    const frame = map.getBoundingClientRect();
    if (!frame.width) return;
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      const [left, top] = [r.left - frame.left, r.top - frame.top];
      return { left, top, right: left + r.width, bottom: top + r.height, cx: left + r.width / 2, cy: top + r.height / 2 };
    };
    const at = new Map([...boxes].map(([c, b]) => [c, { ...b, ...rect(b.el) }]));
    const GAP = 3; // space between a line's end and the box it points to
    svg.replaceChildren();
    svg.setAttribute("viewBox", `0 0 ${frame.width} ${frame.height}`);

    // Lines that meet the same side of a box are spread along it, in the
    // order of where they come from, so they do not sit on top of each other.
    // The first pass counts them and the second pass draws.
    const ports = {};
    let drawing = false;
    const port = (n, side, id, order) => {
      const list = (ports[n.code + side] = ports[n.code + side] || []);
      if (!drawing) { list.push({ id, order }); return n.cy; }
      const rank = [...list].sort((p, q) => p.order - q.order).findIndex((p) => p.id === id);
      return n.cy + (rank - (list.length - 1) / 2) * 9;
    };

    const run = () => {
      const brackets = {};
      links.forEach((link, id) => {
        const [a, b] = [at.get(link.from), at.get(link.to)];
        if (!a || !b) return;
        let d;
        let tip; // where the arrowhead sits and the way it points (degrees)
        if (a.col === b.col) {
          const [top, bottom] = a.cy < b.cy ? [a, b] : [b, a];
          const between = [...at.values()].some((n) => n.col === a.col && n.cy > top.cy && n.cy < bottom.cy);
          if (!between) {
            // Straight up or down between neighbours.
            const up = a.cy > b.cy;
            tip = { x: b.cx, y: up ? b.bottom + GAP : b.top - GAP, turn: up ? -90 : 90 };
            d = `M${a.cx} ${up ? a.top : a.bottom} L${tip.x} ${tip.y}`;
          } else {
            // A bracket round the boxes in between, on the left of the column.
            // The longer bracket leaves higher up, so brackets nest.
            const n = (brackets[a.col] = (brackets[a.col] || 0) + 1);
            const out = a.left - 10 - 14 * n;
            const [ya, yb] = [port(a, "L", id, -Math.abs(b.cy - a.cy) * Math.sign(b.cy - a.cy)), port(b, "L", id, -Math.abs(a.cy - b.cy) * Math.sign(a.cy - b.cy))];
            tip = { x: b.left - GAP, y: yb, turn: 0 };
            d = `M${a.left} ${ya} C${out} ${ya} ${out} ${yb} ${tip.x} ${yb}`;
          }
        } else {
          const right = a.col < b.col;
          const [sa, sb] = right ? ["R", "L"] : ["L", "R"];
          const [x1, x2] = right ? [a.right, b.left - GAP] : [a.left, b.right + GAP];
          if (Math.abs(a.col - b.col) === 1) {
            // Side to side between neighbouring columns.
            const [ya, yb] = [port(a, sa, id, b.cy), port(b, sb, id, a.cy)];
            const mid = (x1 + x2) / 2;
            d = `M${x1} ${ya} C${mid} ${ya} ${mid} ${yb} ${x2} ${yb}`;
            tip = { x: x2, y: yb, turn: right ? 0 : 180 };
          } else {
            // Skipping a column: go round through the space above the row,
            // where there are no boxes.
            const lane = b.el.closest(".cd-map-row").getBoundingClientRect().top - frame.top + 8;
            const [ya, yb] = [port(a, sa, id, lane - 1000), port(b, sb, id, lane - 1000)];
            const [g1, g2] = right ? [x1 + 14, x2 - 14] : [x1 - 14, x2 + 14];
            d = rounded([{ x: x1, y: ya }, { x: g1, y: ya }, { x: g1, y: lane }, { x: g2, y: lane }, { x: g2, y: yb }, { x: x2, y: yb }]);
            tip = { x: x2, y: yb, turn: right ? 0 : 180 };
          }
        }
        if (!drawing) return;
        svg.append(s("path", { class: `cd-link is-${link.kind}`, d }));
        if (link.kind === "leads") {
          svg.append(s("path", { class: "cd-arrow", d: "M-8 -4.5L0 0L-8 4.5Z", transform: `translate(${tip.x} ${tip.y}) rotate(${tip.turn})` }));
        }
      });
    };
    run();
    drawing = true;
    run();
  }

  function anchors(cd) {
    return section("Anchor experiences", cd.anchors, items(cd.anchors.map((a) =>
      h("div", { class: "cd-item" },
        head(a, a.title),
        h("p", {}, text(a.phenomenon)),
        label("Students do"), h("p", {}, text(a.students_do)),
        label("You need"), list(a.materials),
        label("It shows"), h("p", {}, text(a.shows)),
        a.caution ? [label("Watch for"), h("p", {}, text(a.caution))] : null))));
  }

  function pitfalls(cd) {
    return section("Teacher pitfalls", cd.pitfalls, items(cd.pitfalls.map((p) =>
      h("div", { class: "cd-item" },
        head(p, p.pitfall),
        label("Instead"), h("p", {}, text(p.instead))))));
  }

  function sources(cd) {
    return h("details", { class: "acc", id: "sources" },
      h("summary", {}, h("span", { class: "acc-title" }, "Sources"),
        h("span", { class: "acc-hint" }, `${cd.sources.filter((s) => s.read).length} read · ${cd.sources.filter((s) => !s.read).length} cited by those`)),
      h("div", { class: "acc-body" },
        h("ol", { class: "cd-sources" }, cd.sources.map((s) =>
          h("li", { id: `source-${s.id}`, class: s.read ? null : "unread" },
            s.citation, " ",
            s.url ? h("a", { href: s.url, target: "_blank", rel: "noopener" }, "Open") : null,
            s.read
              ? h("span", { class: "small muted" }, ` Read ${niceDate(s.accessed)}.`)
              : h("span", { class: "small" }, ` Not read: known through source [${sourceNumbers.get(s.via)}].`))))));
  }

  // ---- Side column ----

  function usedIn(cd, units, cycle) {
    const rows = (units && units[cd.code]) || [];
    const place = cyclePlaces(cycle).get(cd.code);
    return h("div", { class: "card stack-tight" },
      h("h2", { class: "card-title" }, "Used in"),
      rows.length
        ? rows.map((u) => h("a", { class: "link-row", href: `../${u.url}` }, u.title, h("span", { class: "small muted" }, ` · ${u.where}`)))
        : h("p", { class: "small muted" }, "No unit in the hub lists this code yet."),
      place ? h("a", { class: "link-row", href: "./" }, "Science cycle", h("span", { class: "small muted" }, ` · ${place}`)) : null);
  }

  // ---- Pages ----

  function showSheet(cd, index, units, cycle) {
    sourceNumbers = new Map(cd.sources.map((s, i) => [s.id, i + 1]));
    document.title = `${cd.code} ${cd.title} · FCPS STEAM`;
    root.replaceChildren(
      h("p", { class: "crumbs" }, h("a", { href: "../" }, "Overview"), " / ", h("a", { href: "./" }, "Science cycle"), ` / ${cd.code}`),
      h("section", { class: "hero" },
        h("div", { class: "hero-text" },
          h("p", { class: "hero-kicker" }, `${cd.code} · ${cd.learning_area} · ${cd.band} · ${cd.sub_strand}`),
          h("h1", {}, cd.title))),
      official(cd),
      h("div", { class: "columns" },
        h("section", { class: "main-col accs" },
          paraphrase(cd), keyQuestions(cd), assessment(cd), vocabulary(cd), misconceptions(cd), inquiry(cd),
          humanEndeavour(cd), related(cd, index), anchors(cd), pitfalls(cd), sources(cd)),
        h("aside", { class: "side-col stack" }, usedIn(cd, units, cycle))));

    // A source number opens the Sources section and moves to that source.
    root.addEventListener("click", (event) => {
      const link = event.target.closest("[data-source]");
      if (link) document.getElementById("sources").open = true;
    });
  }

  // ---- The Science cycle (the front page) ----
  // What each year level learns across the school's two-year cycle, from
  // cycle.json. An understanding with a fact sheet opens it.

  // Left to right, in the order James asked for.
  const STRANDS = ["Physical sciences", "Earth and space sciences", "Biological sciences", "Chemical sciences"];

  // "Year 3/4, odd years" for each code in the cycle.
  function cyclePlaces(cycle) {
    const places = new Map();
    for (const row of (cycle && cycle.rows) || []) {
      for (const [key, when] of [["every", "every year"], ["odd", "odd years"], ["even", "even years"]]) {
        for (const item of row[key] || []) places.set(item.code, `${row.label}, ${when}`);
      }
    }
    return places;
  }

  function cycleItem(item, sheets) {
    const sheet = sheets.get(item.code);
    return h("div", { class: `cyc-item${sheet ? " has-sheet" : ""}` },
      h("span", { class: "cyc-short", title: item.text }, item.short),
      h("span", { class: "cyc-meta" },
        h("a", { class: "chip", href: vcaaUrl(item.code), target: "_blank", rel: "noopener", title: `Open ${item.code} in the Victorian Curriculum` }, item.code),
        sheet ? h("a", { class: "cyc-sheet", href: `?code=${item.code}`, title: `Open the fact sheet: ${sheet.title}` }, "Fact sheet") : null),
      h("span", { class: "cyc-text" }, item.text),
      item.note ? h("span", { class: "cyc-note" }, item.note) : null);
  }

  // One screen: a column for each strand, a row for each year level. Both
  // years are in the page and the switch above the table shows one of them.
  function cycleTable(cycle, sheets) {
    const items = (row, key, s) => (row[key] || []).filter((i) => i.sub === s).map((i) => cycleItem(i, sheets));
    const cell = (row, s) => h("td", {},
      row.every
        ? items(row, "every", s)
        : [h("div", { class: "cyc-odd" }, items(row, "odd", s)), h("div", { class: "cyc-even" }, items(row, "even", s))]);
    return h("div", { class: "cyc-scroll" },
      h("table", { class: "cyc" },
        h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Year level"), STRANDS.map((s) => h("th", { scope: "col" }, s.replace(" sciences", ""))))),
        h("tbody", {}, cycle.rows.map((row) => h("tr", {},
          h("th", { scope: "row", class: "cyc-year" }, row.label, row.every ? h("span", { class: "cyc-years" }, "Every year") : null),
          STRANDS.map((s) => cell(row, s)))))));
  }

  // The odd or even switch, and the switch for the full wording.
  function cycleControls(cycle, view) {
    const yearButton = (key) => h("button", { type: "button", class: "cyc-switch", "data-year": key, "aria-pressed": "false" },
      cycle.years[key].label);
    const full = h("button", { type: "button", class: "cyc-switch cyc-full", "aria-pressed": "false" }, "Official wording");
    const bar = h("div", { class: "cyc-controls" },
      h("div", { class: "cyc-toggle", role: "group", "aria-label": "Year of the cycle" }, yearButton("odd"), yearButton("even")),
      full);
    const show = (key) => {
      view.dataset.year = key;
      bar.querySelectorAll("[data-year]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.year === key)));
    };
    bar.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.year) show(button.dataset.year);
      else full.setAttribute("aria-pressed", String(view.classList.toggle("is-full")));
    });
    // Odd years show first.
    show("odd");
    return bar;
  }

  function showIndex(index, cycle) {
    const sheets = new Map(index.map((o) => [o.code, o]));
    const places = cyclePlaces(cycle);
    const extra = index.filter((o) => !places.has(o.code));
    const sheetCard = (o) =>
      h("a", { class: "card cd-index-link", href: `?code=${o.code}` },
        h("span", { class: "code" }, o.code),
        h("span", { class: "name" }, o.title),
        h("span", { class: "small muted" }, `${o.band} · ${o.sub_strand}`));
    document.title = "Science cycle · FCPS STEAM";
    // The switch sits beside the heading, so the whole table fits one screen.
    const view = cycle ? h("div", { class: "cyc-view" }, cycleTable(cycle, sheets)) : null;
    root.replaceChildren(...[
      h("div", { class: "page-head cyc-head" },
        h("h1", {}, "Science cycle"),
        cycle ? cycleControls(cycle, view) : null),
      cycle
        ? [view,
          h("p", { class: "cyc-foot" },
            cycle.matched === "draft" ? [`Which description is taught when was matched by Claude from the ${cycle.source}, and the short statements are Claude's. Both need James's check. `] : null,
            cycle.attribution)]
        : h("p", { class: "ph" }, "[The Science cycle could not be loaded]"),
      // Fact sheets for codes that are not in the cycle would be listed here.
      extra.length ? [h("h2", { class: "cyc-more" }, "Other fact sheets"), h("div", { class: "card-grid fill" }, extra.map(sheetCard))] : null,
    ].flat(Infinity).filter(Boolean));
  }

  function showError(message) {
    root.replaceChildren(
      h("p", { class: "crumbs" }, h("a", { href: "./" }, "Curriculum fact sheets")),
      h("p", { class: "ph" }, `[${message}]`));
  }

  (async () => {
    let index;
    try {
      index = (await getJson("index.json")).objects;
    } catch {
      return showError("The list of fact sheets could not be loaded");
    }
    const cycle = await getJson("cycle.json", true);
    if (!code) return showIndex(index, cycle);
    if (!/^VC2S[A-Z0-9]+$/.test(code) || !index.some((o) => o.code === code)) {
      return showError(`There is no fact sheet for ${code.slice(0, 20)} yet`);
    }
    try {
      const [cd, units] = await Promise.all([getJson(`objects/${code}.json`), getJson("units.json", true)]);
      showSheet(cd, index, units, cycle);
    } catch {
      showError(`The fact sheet for ${code} could not be loaded`);
    }
  })();
})();
