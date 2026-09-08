<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Sema-Dur — project notes

Redesign + online catalogue for **Talleres Sema-Dur SL** (brand *Diacort*), a
cutting-tool manufacturer in Humanes de Madrid. See `README.md` for the commerce
architecture and how to switch Stripe on.

- Stack mirrors `../toldos-getafe` and `../sbs-telecom`: Next.js App Router,
  `output: "export"`, Tailwind v4, TypeScript. No server at runtime.
- Forms post to **Netlify Forms** (`data-netlify="true"`). Stripe lives in
  `netlify/functions/` and stays dormant until env vars are set.
- Catalogue is **quote-first**: every product is "Consultar precio". Never invent
  prices, SKUs, stock numbers or legal copy.
- Design tokens live in `src/app/globals.css`. Content lives in `src/data/`.
