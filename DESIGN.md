# DESIGN.md

The design system for [cauchon.net](https://cauchon.net). Consult this before adding a new page so pages stay coherent without re-reading `css/home.css`. When you add a new pattern, update this file in the same commit.

## Direction

**Warm Editorial.** Off-white paper, warm black ink, cobalt accent. Reads like a printed journal — serif display type, clear rules between sections, monospace metadata. Playful in small doses (squiggle nav underlines, italic accent swaps, the hover-jiggle "0" on 404). Never sterile, never skeuomorphic.

Guiding principles:
- **Content first.** The type does the work; decoration is sparing.
- **Rules over boxes.** Prefer `border-top: 1px solid var(--ink)` section dividers to cards.
- **One accent.** Cobalt `--accent` for interactive/italic emphasis only. Don't introduce more hues.
- **Monospace is metadata.** Dates, labels, eyebrows, receipts — never body copy.
- **Italic is emphasis.** Pair italic with accent color for names, key words, playful moments.

## Tokens (`:root` in `css/home.css`)

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--bg` | `#f4f4f2` | `#0e0e0c` | page background |
| `--bg-alt` | `#ebeae5` | `#1a1a18` | cards, code blocks, receipts |
| `--paper` | `#fffdf8` | `#161614` | reserved for paper-feeling surfaces |
| `--ink` | `#111111` | `#f1efe8` | primary text, hard rules |
| `--ink-soft` | `#3a3a38` | `#cfcdc5` | secondary text, body copy in two-col |
| `--ink-mute` | `#6b6b67` | `#89877f` | metadata, labels, captions |
| `--rule` | `rgba(17,17,17,0.12)` | `rgba(241,239,232,0.14)` | soft dividers between rows |
| `--accent` | `#3b5bdb` | `#9bb0ff` | italic emphasis, hover, links in post body |
| `--accent-soft` | `#eef1fb` | `#1b2040` | hover backgrounds |

Dark mode activates via `data-theme="dark"` on `<html>`. Theme toggle + `prefers-color-scheme` logic lives in `_layouts/home.html`.

## Typography

Three families, all loaded in `_layouts/home.html`:

- **Fraunces** (serif display) — titles, tagline, work/post titles, lede. Variable with `SOFT`, `WONK`, `opsz`. Italic + accent is the signature move.
- **Inter** (sans body) — paragraph copy, nav, body UI. `font-feature-settings: 'ss01', 'cv11'`.
- **JetBrains Mono** — dates, labels, eyebrows, receipts, footer. Always uppercase with `letter-spacing: 0.08–0.12em`.

Sizes on the homepage/body (adjust in media queries at 960px and 700px):

| Role | Size | Family |
|------|------|--------|
| Hero title | 220px | Fraunces, `letter-spacing: -0.045em` |
| Writing title | 140px | Fraunces |
| 404 digits | 280px | Fraunces |
| Post title | 64px | Fraunces |
| Section h2 | 44px (home), 32px (writing/404) | Fraunces |
| Tagline / lede | 32px / 24px | Fraunces |
| Body | 17px | Inter |
| Post body | 20px | Inter, `line-height: 1.65` |
| Row title | 24px | Fraunces |
| Metadata / labels | 11–13px | JetBrains Mono, uppercase |

## Layout

- One container: `#root { max-width: 1280px }` inside `<body>` flex-centered.
- Page padding: `64px 88px 80px` → `48px 36px 64px` (≤960px) → `32px 20px 48px` (≤700px).
- Post body narrows to `max-width: 720px`, centered.
- Section rhythm: `margin-bottom: 72px` between major sections; `border-top: 1px solid var(--ink)` + `padding-top: 14px` opens a section.
- Row rhythm inside lists: `border-bottom: 1px solid var(--rule)`, `padding: 14–24px 0`.

## Component inventory

Every component already lives in `css/home.css` — reuse before inventing.

| Component | Class | Use on |
|-----------|-------|--------|
| Site header + logo | `.site-header`, `.site-logo` | all pages using `layout: home` |
| Squiggle nav | `.site-nav` + `.squiggle` | via `_includes/nav.html` |
| Hero | `.hero`, `.hero h1` | homepage only |
| Tagline | `.tagline` | below hero |
| Marquee | `.marquee`, `.marquee__track`, `.marquee__item` | homepage status strip |
| Two-column info | `.two-col`, `.col-label`, `.col-body` | Currently / Elsewhere |
| Section head | `.section`, `.section-head` | labeled sections with heavy top rule |
| Work row | `.work-row` (year / title / note) | work history |
| Side projects grid | `.side-projects__grid`, `.side-projects__item` (+ `__title`, `__note`) | 2-col editorial grid. Fraunces title (20px, matches Work rows) + Fraunces italic `--ink-soft` note. No metadata row. Collapses to 1-col ≤700px. |
| Post row (home) | `.writing a.post-row` | homepage posts preview |
| Writing hero | `.writing-hero`, `.writing-title`, `.writing-lede` | `/posts` top |
| Post index row | `.writing-row` | `/posts` list |
| Eyebrow | `.eyebrow` | monospace label above titles |
| Post body | `.post`, `.post-body` | individual post content |
| Receipt | `.lost-receipt`, `.lost-receipt__row` | 404 error readout (reusable for any key/value display) |
| Detour cards | `.lost-detours`, `.lost-detour` | grid of outbound links |
| Footer | `.site-footer` + `.theme-toggle` | via `_includes/footer.html` |

## Layout choices

Use `layout: home` for every new page. It's the standalone Warm Editorial layout — includes head/favicons/analytics, loads `home.css`, and wires the theme toggle.

Do **not** use `layout: layout` (legacy sidebar, `base.css`/`post.css`) for new work. It exists only to keep `projects.html` working.

Always include the shared nav and footer:

```liquid
{% include nav.html current="posts" %}
...
{% include footer.html %}
```

`current` should be one of: `home`, `posts` — drives the `aria-current="page"` squiggle.

## Building a new page

1. Create `newpage.html` with front matter `layout: home`, `title`, `description`, `permalink`.
2. Include nav, wrap content in `<main class="page">`, include footer.
3. Compose from existing components above. If the page needs a hero, mirror `.writing-hero` + `.writing-title` with an italic accent span.
4. Keep copy in the HTML; keep style in `home.css`. Per-page one-off styles go at the bottom of `home.css` under a clearly labeled comment block (see the `/* 404 / Lost page */` section as the template).
5. Verify both themes (toggle in footer) and both breakpoints (960px, 700px).

## When to invent vs reuse

Reuse when the pattern exists. Invent only when:
- A genuinely new page archetype appears (e.g., a gallery, a timeline).
- The new component is reusable across ≥2 pages.

When inventing: follow the naming (`.page-name__element`), the token palette, the type trio, and the 72px/24px/14px rhythm. Add it to the component inventory above.

## Anti-patterns

- Introducing a second accent color or gradient.
- Drop shadows, glassmorphism, or rounded corners above 4px.
- Emoji in UI chrome (copy is fine in posts).
- Inline styles in templates; per-page `<style>` blocks (put it in `home.css`).
- Body copy in JetBrains Mono.
- Raw `<h1>`/`<h2>` without a class — every heading picks up a deliberate Fraunces size via a component class.
- Hardcoding hex values — always reference tokens so dark mode works.
