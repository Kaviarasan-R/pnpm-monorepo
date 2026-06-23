FROM ghcr.io/pnpm/pnpm:11 AS build

RUN pnpm runtime set node 22 -g

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY apps/web/ apps/web/
COPY libs/eslint-config/ libs/eslint-config/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @boilerplate/web build
RUN pnpm --filter @boilerplate/web deploy --prod deploy/

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/deploy/.next/standalone/apps/web/. ./
COPY --from=build /app/deploy/.next/static ./.next/static
COPY --from=build /app/deploy/public ./public
COPY --from=build /app/deploy/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "server.js"]
