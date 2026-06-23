FROM ghcr.io/pnpm/pnpm:11 AS build

RUN pnpm runtime set node 22 -g

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.json ./
COPY apps/api/ apps/api/
COPY libs/ libs/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @boilerplate/data-sources build
RUN pnpm --filter @boilerplate/message-queues build
RUN pnpm --filter @boilerplate/api build
RUN pnpm --filter @boilerplate/api deploy --prod deploy/

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/deploy/dist ./dist
COPY --from=build /app/deploy/node_modules ./node_modules
COPY --from=build /app/deploy/package.json ./

EXPOSE 3000

CMD ["node", "dist/main"]
