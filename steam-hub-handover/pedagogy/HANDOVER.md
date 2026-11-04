# Handover: Pedagogy and sources (STEAM hub)

Build a pedagogy tagging feature for the STEAM hub. Each lesson shows which teaching practices it targets, with the full path back to the source framework and a link to the source document. Each unit shows the same tags as an at-a-glance grid across its lessons.

Files in this handover:

- `lenses.json`: the controlled vocabulary (60 nodes). Copy it into the hub's data folder.
- `pedagogy-reference.html`: a standalone visual reference for the lesson accordion and unit grid. It's a reference only. Match the hub's existing styles; don't copy its CSS.

## 1. Principles

- **Use the hub's existing styles.** Take fonts, spacing, radii and base colours from the hub's current stylesheet and CSS variables (near-black background, violet primary). Add only the four tier colours below as new variables.
- **Two levels only:** `focus` (what the lesson deliberately targets, usually 1 to 3 tags) and `present` (it happens, but isn't the target). No other levels.
- **Practices appear across a unit, not in every lesson.** The grid should make gaps visible, not imply every row needs a dot in every column.
- **Routines don't get ticked.** Nodes with `"routine": true` (e.g. the values acknowledgement) appear once on the unit page as "Built into every lesson", not as a grid row.
- **No progress tracking.** Don't add class progress, completion ticks or per-class status anywhere.

## 2. Data model

### Vocabulary (`lenses.json`)

Each node:

| Field | Meaning |
|---|---|
| `label` | Display name |
| `tier` | `department`, `fcps`, `adopted` or `curriculum` |
| `parent` | Parent node id, or `null` |
| `icon` | Tabler outline icon class (`ti-...`) |
| `path` | Breadcrumb array shown under the label |
| `source_url` | Link to the source, or `null` |
| `source_label` | Link text |
| `requires_login` | `true` for Arc or Drive links: show a lock icon |
| `verified` | Whether the link and name were confirmed on an official page |
| `checked` | Date the link was last checked |
| `further` | Optional extra links (show as small secondary links) |
| `notes` | Internal notes for James. Never show these to students |
| `routine` | Optional. See principles |

### Lesson data

Add a `pedagogy` object to each lesson's existing data:

```json
"pedagogy": {
  "vtlm.explicit.focus": "focus",
  "vtlm.explicit.scaffold": "focus",
  "pcms.6": "present",
  "citw.interest_cues": "focus",
  "vc.dt": "focus"
}
```

Validation (at build time, or a console warning in dev): every key must exist in `lenses.json`, and every value must be `focus` or `present`.

## 3. Link resolution

1. If the node has a `source_url`, use it.
2. Otherwise walk up `parent` until a node has one, and use that. Label it as e.g. "VTLM 2.0 Guide Pack (Arc)" so it's clear it's the broader source.
3. If nothing up the chain has a link, show the label in amber with a link-off icon and the text "add link". Only James sees the hub, so this is a useful to-do marker.

Links open in a new tab (`target="_blank" rel="noopener"`). Show `ti-external-link`, or `ti-lock` when `requires_login` is true.

## 4. Lesson page: "Pedagogy and sources" accordion

- A collapsible section on the lesson page, using the hub's existing accordion pattern if there is one. Open by default on the teacher view. Header shows the tag count.
- One row per tag, ordered: focus before present, then by tier (department, adopted, fcps, curriculum).
- Each row:
  - **Icon tile:** 30 to 32px rounded square, tier background colour, icon in the tier's bright colour.
  - **Label** (medium weight) with the **level** right-aligned in small tier-coloured text ("Focus", "Present").
  - **Path** always visible underneath, small and muted, joined with " › ".
  - **Source link** underneath (rules in section 3).
- Not shown on student-facing views.

## 5. Unit page: "Pedagogy at a glance" grid

- A collapsible section on the unit page.
- Rows: every practice used in at least one of the unit's lessons, grouped by tier with a small tier heading. Each row starts with the icon and label (truncate with ellipsis on narrow screens).
- Columns: lessons (L1 to L8). Highlight the column of the lesson the user came from, if any.
- Cells: filled dot in the tier colour = focus; outlined dot = present; empty = not used.
- Clicking a row label opens that node's source link. Clicking a column header goes to that lesson.
- Below the grid: a "Built into every lesson" line listing routine nodes, then a small legend (focus, present, tier colours).
- Must work at phone width (about 380px): label column around 45%, lesson columns share the rest.

## 6. Tier colours

On the hub's near-black background:

| Tier | Tile background | Bright (icon, dots, level text) |
|---|---|---|
| department | `#2A1F6E` | `#A996FF` |
| fcps | `#0E3A33` | `#4FE0C0` |
| adopted | `#4A1E1A` | `#FF8A6B` |
| curriculum | `#26252C` | `#C9C6D6` |

Missing link: `#FFC857`. Define these as CSS variables next to the hub's existing ones.

## 7. Icons

Use Tabler Icons (outline webfont, MIT licence) from a CDN the hub can load, e.g. `https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css`. Use outline icons only. If an icon class in `lenses.json` doesn't render, fall back to `ti-tag` and log the id.

## 8. Link checker (small script)

Add `scripts/check-links.mjs` that:

- Reads `lenses.json` and requests every `source_url` and `further` URL where `requires_login` is false.
- Reports dead links (4xx/5xx or network error) and nodes with `verified: false`.
- Can update `checked` dates in place with a `--write` flag.
- Skips Arc and Drive links, which need a login.

Run it once a term.

## 9. Things James still needs to fill in

These are flagged in `lenses.json` (`verified: false` or `source_url: null`):

- Individual Arc guide URLs for Focus the learning, Explicit explanation and modelling, Monitor progress, and the Enabling learning and Supported application strategies. Until then they fall back to the Guide Pack.
- The remaining Supported application strategies (only "Vary practice" is confirmed).
- PCMS placemat URLs for practices 1 to 5, 7 and 8 (practice 6 is confirmed).
- CITW phase placements: confirm against the book.
- Drive links for the FCPS values matrix, PLT notes and AIP.
- Digital Technologies and Science VCAA URLs (they follow the confirmed D&T pattern).

## 10. Done when

- [ ] `lenses.json` loads, and invalid tag ids or levels are flagged.
- [ ] Lesson page shows the accordion with icon, label, level, always-visible path and resolved link for every tag.
- [ ] Missing links fall back to the nearest parent, or show the amber "add link" state.
- [ ] Unit page shows the grid with focus and present dots, tier grouping, the routine line and a legend.
- [ ] Both look native to the hub's existing design and work at 380px wide.
- [ ] Neither appears on student-facing views.
- [ ] Link checker runs and reports.
