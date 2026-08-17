# AzizFitness - Modernization Project Overview

This document provides an overview of the AzizFitness website modernization project. It is intended to help collaborators understand the project architecture, the migration path taken, and how to maintain or deploy the site.

## 1. Project Goal
The goal was to modernize the legacy static HTML/CSS/JS AzizFitness website into a maintainable, component-based architecture using **Astro**. This improves performance, developer experience, and scalability while preserving the original content and design.

## 2. Tech Stack
- **Framework:** [Astro](https://astro.build/) (Static Site Generator)
- **Styling:** Vanilla CSS (Modern dark-mode aesthetic with custom gold branding)
- **Interactivity:** Vanilla JavaScript (`main.js`)

## 3. Project Structure
The project is located in `azizfitness/`.

```text
azizfitness/
├── public/          # Static assets (images, icons, styles.css)
├── src/
│   ├── layouts/     # Reusable Page Layout (base HTML, nav, footer)
│   └── pages/       # Individual site pages (.astro files)
├── astro.config.mjs # Astro configuration
└── package.json     # Project dependencies and scripts
```

## 4. Key Architectural Decisions
- **Unified Layout:** Instead of repeating navigation and footer code across every HTML file, we created a single `Layout.astro` component in `src/layouts/`.
- **Component-Based:** Each page in `src/pages/` consumes the `Layout` component, reducing code duplication.
- **Asset Handling:** Static assets are served from the `public/` directory, accessed via absolute paths (e.g., `/Logo.png`).

## 5. Maintenance & Development

### Local Development
To work on the project locally:
1. Navigate to the project directory: `cd azizfitness`
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm dev`

### Building for Production
To generate the final static files:
1. Run the build command: `pnpm build`
2. The production files will be output to `azizfitness/dist/`.

## 6. Migration Summary (From Legacy)
- All HTML files were converted to `.astro` pages.
- Navigation links were updated to absolute paths.
- Asset references were updated to be relative to the `public/` root.
- The branding (fonts: 'Inter', 'Space Grotesk'; color: #C6A86B) was applied via a centralized `styles.css`.

## 7. Next Steps for Colleague
1. **Verify Functionality:** Ensure `main.js` still correctly interacts with the new markup (mobile menu, calculator, etc.).
2. **Dynamic Metadata:** Improve SEO by making page titles/descriptions dynamic in `Layout.astro`.
3. **Deployment:** Point your preferred hosting platform (Netlify, Vercel, etc.) to the `dist/` directory.
