# PACKAGING & DISTRIBUTION GUIDE — VIỆT PHỤC REMIX
**Phase 7: Clean Source Archive Specification**  
**Date:** 2026-09-25  

This document specifies the exact contents, exclusions, and compression commands for packaging the Việt Phục Remix source code.

---

## 1. Clean Source Archive Structure

A clean submission ZIP or repository export must contain:

```
viet-phuc-remix/
├── content/              # Cultural datasets, source tracker (TODO_SOURCES.csv), and proposed rules
├── docs/                 # Concept, pitch scripts, research toolkit, acceptance, QA, and licenses
├── public/               # Static assets
├── src/                  # Application source code (pages, components, engines, design system)
├── tests/                # Unit tests, integration tests, and schema validators
├── .gitignore            # Git exclusion rules
├── .oxlintrc.json        # Linter configuration
├── index.html            # Application entry HTML
├── package.json          # Project metadata, dependencies, and NPM scripts
├── package-lock.json     # Pinned dependency tree
├── tsconfig.json         # TypeScript base configuration
├── tsconfig.app.json     # Application TypeScript config
├── tsconfig.node.json    # Tooling TypeScript config
├── vite.config.ts        # Vite 8 build configuration
└── README.md             # Project guide & quick start
```

---

## 2. Strictly Excluded Items

Never include the following in the submission archive:
- `node_modules/` (Heavy dependency directory; easily restored via `npm install`)
- `dist/` (Generated build output; built cleanly via `npm run build`)
- `.env*` (Environment files and secrets)
- `coverage/` and `.nyc_output/` (Test runner coverage reports)
- `.git/` (If creating a clean vendor/audition ZIP archive)
- OS junk files (`.DS_Store`, `Thumbs.db`)

---

## 3. Recommended Packaging Command

To generate a clean ZIP archive for audition submission:

```bash
# From workspace root:
zip -r viet-phuc-remix-source.zip \
  content/ \
  docs/ \
  public/ \
  src/ \
  tests/ \
  .gitignore \
  .oxlintrc.json \
  index.html \
  package.json \
  package-lock.json \
  tsconfig*.json \
  vite.config.ts \
  README.md \
  -x "node_modules/*" "dist/*" ".git/*" "*.log"
```

The resulting archive size is typically under **1.5 MB**, making it lightweight and instantly deliverable via email or submission portals.
