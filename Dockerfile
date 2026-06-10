# Base
FROM node:24.16-alpine3.22 AS base
ENV PATH="/pnpm:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

# Builder
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Runner
FROM base AS runner
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY drizzle ./drizzle

USER node
EXPOSE 5000
CMD ["node", "dist/server.js"]
