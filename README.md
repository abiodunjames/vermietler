# Vermietler Landing Page

Static marketing site built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com). Deployed to GitHub Pages.

## Prerequisites

- Node.js 22+

## Getting started

```bash
cd landing
npm install
npm run dev
```

Open http://localhost:4321 to preview.

## Build

```bash
npm run build
npm run preview   # preview the production build locally
```

Static output is written to `dist/`.

## i18n

The site supports English (default) and German:

- English: `/`
- German: `/de/`

Each component accepts a `lang` prop. All copy is co-located in the component files.

## Deployment

Pushing to `main` with changes under `landing/` triggers the GitHub Actions workflow at `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages.

To deploy manually, run the workflow from the Actions tab (`workflow_dispatch`).

## Project structure

```
src/
├── layouts/Layout.astro       # HTML shell, meta, fonts
├── styles/global.css          # Tailwind + theme tokens
├── pages/
│   ├── index.astro            # EN landing page
│   └── de/index.astro         # DE landing page
├── components/
│   ├── Navbar.astro           # Fixed nav, lang switcher
│   ├── Hero.astro             # Headline, CTA, stats
│   ├── Features.astro         # 8-feature grid
│   ├── HowItWorks.astro       # 4-step process
│   ├── Pricing.astro          # 3-tier pricing cards
│   ├── CTA.astro              # Call-to-action banner
│   └── Footer.astro           # Links, copyright
public/
└── images/                    # Screenshots, logos, assets
```
