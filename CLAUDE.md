# Boilerplate

## Commands

- Dev: `pnpm run dev`
- Build: `pnpm run build`
- Lint: `pnpm run lint`
- Start: `pnpm run start`
- Generate Library: `pnpm generate:lib <name>`

## Stack

- Node.js v22 LTS
- `pnpm` ^11.5.3
- Typescript v5
- Nest.js v11
- React v19, functional components only
- Next.js v16, app router only
- Tailwindcss v4

## Monorepo

- `apps/api` - Nest.js HTTP API + Swagger docs
- `apps/worker` - Nest.js background worker (BullMQ + Redis)
- `apps/web` - Next.js frontend
- `libs/` - shared libraries (`@boilerplate/*`)
- `migrations/` - TypeORM migrations (master + tenant)
- `tsconfig.json` - Common TS config files for all frontend, backend, migrations & libs
- `.prettierrc` - Common monorepo prettier
- `libs/eslint-config` - Common eslint for all frontend, backend & libs

## Rules

- Libs are resolved from source when running in dev via `tsconfig.json` paths, when running in production it sources from `dist/` via `tsconfig.build.json` (empty paths)
- All `apps/*`, `libs/*`, `migrations/*` are CommonJS, the root `tsconfig.json` is ModuleJS but still all `package.json` found in the monorepo use CommonJS
- Workspace packages use `workspace:*`
- `pnpm-workspace.yaml` has `injectWorkspacePackages: true`
- Build libs before running migrations
