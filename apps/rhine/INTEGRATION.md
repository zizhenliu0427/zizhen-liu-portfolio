# Rhine archive in the portfolio

The main portfolio builds this directory with Vite's `portfolio` mode, using
`/rhine/` for assets, manifest and service worker scope. Run `npm run build:rhine`
from the root to refresh the generated `/` Rhine entry; the standalone source
file remains under `/rhine/index.html` for the static archive build.
redirects there. `npm run dev:rhine` retains the independent port 5174 preview.

Imported from the working tree of https://github.com/zizhenliu0427/zizhen-liu-portfolio-rhine, based on commit c939303, including the authorised bilingual archive, 31 models and category IDs.

Upstream: https://github.com/LBEILC/RhineLabUI. Keep LICENSE, public/licenses and docs/UPSTREAM-README.md with the sources. This is an in-repository source copy, not a nested Git repository. The sibling checkout is retained as a reference.

Blender source projects, generators, evidence and verification notes are preserved. Local tooling, dependencies, caches, private environment files and individually licensed font kits were excluded using the source repository ignore rules.
