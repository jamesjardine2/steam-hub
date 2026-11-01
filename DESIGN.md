# STEAM Hub design system: "Electric"

A dark theme built on near-black, with electric accents led by a vivid violet. Use these tokens for every page in the hub. Don't add colours or fonts that aren't listed here.

## Colours

### Base neutrals

| Token | Hex | Use |
|---|---|---|
| `--void` | `#0C0C0F` | Page background |
| `--surface` | `#16161D` | Cards, panels |
| `--raised` | `#22222C` | Hover states, nested panels, inputs |
| `--line` | `#34344A` | Borders, dividers |
| `--mist` | `#A6A6B8` | Secondary and muted text |
| `--glow` | `#F4F4F8` | Primary text |

### Electric accents

| Token | Hex | Use |
|---|---|---|
| `--violet` | `#5329E7` | Primary brand colour. Fills only (buttons, pills, active nav), always with white text |
| `--ultraviolet` | `#8B6BFF` | Violet for text on dark (links, headings accents, focus rings) |
| `--volt-blue` | `#2F6BFF` | Secondary actions, charts |
| `--ion-cyan` | `#00D4FF` | Info, highlights, charts |
| `--plasma-pink` | `#FF2E88` | Badges ("New"), alerts, charts. Dark text on top |
| `--solar-orange` | `#FF7A1A` | Warm highlight, a single call to action per view. Dark text on top |

### Rules

- Don't use `--violet` (#5329E7) as text on `--void`. Its contrast is only about 2.6:1, so use `--ultraviolet` for violet text instead. White text on `--violet` is about 7.4:1, which is fine.
- Use dark text (`--void`) on `--plasma-pink`, `--solar-orange` and `--ion-cyan`. Use white text on `--violet` and `--volt-blue`.
- Use one or two accents per view: violet plus one partner. All six accents together look like an arcade.
- Build depth by stacking neutrals: `--void` page, then `--surface` cards, then `--raised` for hover/nested.
- Keep everything flat: no gradients, glows or drop shadows.
- The hub gets projected in class. Projectors wash out low-contrast greys, so keep anything students need to read in `--glow` (not `--mist`), and don't rely on `--line` alone to separate key areas.

## Typography

- **Primary font:** Plus Jakarta Sans (Google Fonts, free, OFL). Use it for everything.
- **Alternatives if wanted later:** General Sans or Satoshi (Fontshare, free) for headlines; DM Sans (Google Fonts) for body.

Load it with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&display=swap" rel="stylesheet">
```

| Element | Weight | Letter spacing | Line height | Colour |
|---|---|---|---|---|
| Headlines | 800 | -0.02em to -0.03em | 1.05 | `--glow` |
| Body | 400 | normal | 1.5 | `--glow` or `--mist` |
| Nav, buttons, labels | 500 | normal | 1.2 | white on `--violet`, or `--glow` |
| Highlight pills | 800 | -0.02em | 1.05 | `--violet` text in a white rounded pill |

The signature move (from the reference banner) is a large ExtraBold headline with key words set inside white rounded pills in violet text, e.g. "Year 3/4 **[Habitats]** unit".

## Shape

- Cards: `border-radius: 16px`
- Buttons and pills: fully rounded (`border-radius: 999px`)
- Inputs: `border-radius: 10px`

## CSS tokens

```css
:root {
  --void: #0C0C0F;
  --surface: #16161D;
  --raised: #22222C;
  --line: #34344A;
  --mist: #A6A6B8;
  --glow: #F4F4F8;

  --violet: #5329E7;
  --ultraviolet: #8B6BFF;
  --volt-blue: #2F6BFF;
  --ion-cyan: #00D4FF;
  --plasma-pink: #FF2E88;
  --solar-orange: #FF7A1A;

  --font: "Plus Jakarta Sans", system-ui, sans-serif;
  --radius-card: 16px;
  --radius-input: 10px;
  --radius-pill: 999px;
}

body {
  background: var(--void);
  color: var(--glow);
  font-family: var(--font);
  font-weight: 400;
  line-height: 1.5;
}

h1, h2, h3 {
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

a { color: var(--ultraviolet); }

.btn-primary { background: var(--violet); color: #FFFFFF; border-radius: var(--radius-pill); font-weight: 500; }
.btn-highlight { background: var(--solar-orange); color: var(--void); border-radius: var(--radius-pill); font-weight: 500; }
.pill { background: #FFFFFF; color: var(--violet); border-radius: var(--radius-pill); font-weight: 800; padding: 0 0.3em; }
.card { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-card); }
.card:hover { background: var(--raised); }
.badge-new { background: var(--plasma-pink); color: var(--void); border-radius: var(--radius-pill); }
```
