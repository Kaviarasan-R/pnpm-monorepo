# Boilerplate PMS

## Prerequisites

- Node.js 22 LTS
- pnpm 11.6

## Installing Dependencies

```bash
# Install all packages from root
pnpm install

# Add a dependency to a specific package
pnpm --filter @boilerplate/<package> add <pkg>

# Add a devDependency to a specific package
pnpm --filter @boilerplate/<package> add -D <pkg>

# Add a dependency to the root workspace
pnpm -w add -D <pkg>

# If a package needs native builds (e.g. sharp, @swc/core)
# This adds the package to allowBuilds in pnpm-workspace.yaml
pnpm approve-builds
```

## Development

```bash
# Run all apps from root
pnpm dev

# Run specific app from root
pnpm run --filter @boilerplate/<package> dev
```

### Using Libs in Apps

Add path mappings in the app's `tsconfig.json` to resolve libs from source for development only:

```json
{
  "compilerOptions": {
    "paths": {
      "@boilerplate/data-sources": ["../../libs/data-sources/src"],
      "@boilerplate/message-queues": ["../../libs/message-queues/src"]
    }
  },
  "ts-node": {
    "swc": true,
    "compilerOptions": {
      "module": "commonjs"
    }
  }
}
```

Keep `tsconfig.build.json` with empty paths so production builds resolve from `node_modules`:

```json
{
  "compilerOptions": {
    "paths": {}
  }
}
```

The dev script in the app's `package.json` to resolve these at runtime:

```json
"dev": "node --watch -r tsconfig-paths/register -r ts-node/register src/main.ts"
```

For production, build all libs before running the app:

```bash
pnpm build
pnpm start
```

## Generating Libs

```bash
pnpm generate:lib <lib-name>
```

Creates `libs/<lib-name>/` with `package.json`, `tsconfig.lib.json`, `eslint.config.mjs`, and `src/index.ts`. Runs `pnpm install` automatically.

## Migrations

Build libs before running migrations:

```bash
pnpm build
```

```bash
# Create a blank migration file
pnpm migration:create <path>/<file-name>

# Generate migration from entity changes (master)
pnpm migration:master:generate <path>/<file-name>

# Run master migrations
pnpm migration:master:run

# Revert last master migration
pnpm migration:master:revert

# Generate migration from entity changes (tenant)
pnpm migration:tenant:generate <path>/<file-name>

# Run tenant migrations
pnpm migration:tenant:run

# Revert last tenant migration
pnpm migration:tenant:revert
```

## Docker

Build all packages first:

```bash
pnpm install
pnpm build
```

### Build Images

```bash
# API
docker build -f apps/api/Dockerfile -t boilerplate-pms-api:latest .

# Worker
docker build -f apps/worker/Dockerfile -t boilerplate-pms-worker:latest .

# Web
docker build -f apps/web/Dockerfile -t boilerplate-pms-web:latest .
```

### Docker Compose

Runs all services (postgres, redis, api, worker, web):

```bash
docker compose up --build
```

```bash
# Stop and remove containers
docker compose down

# Stop and remove containers + volumes (deletes database data)
docker compose down -v

# Stop and remove containers + images + volumes
docker compose down --rmi all -v
```

## Playwright MCP (web)

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

Open claude session inside `apps/web` then prompt, `navigate to http://localhost:3000 and todo items`

## Links

1. Claude Code Directory - https://code.claude.com/docs/en/claude-directory#explore-the-directory
2. Claude Code `settings.json` - https://code.claude.com/docs/en/settings#available-settings
3. Skills: https://www.skills.sh/anthropics/skills
