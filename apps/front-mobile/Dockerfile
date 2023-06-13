FROM node:18-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk update
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate
ENV PNPM_HOME=/usr/local/bin
# Set working directory
WORKDIR /app
RUN pnpm install turbo --global
COPY . .
RUN turbo prune --scope=front-mobile --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
RUN corepack enable && corepack prepare pnpm@8.6.0 --activate
ENV PNPM_HOME=/usr/local/bin
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm install --frozen-lockfile

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

RUN pnpm turbo run build --filter=front-mobile...

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nuxtjs
USER nuxtjs

COPY --from=installer /app/apps/front-mobile/nuxt.config.ts .
COPY --from=installer /app/apps/front-mobile/package.json .

# Automatically leverage output traces to reduce image size
COPY --from=installer --chown=nuxtjs:nodejs /app/apps/front-mobile/.output ./apps/front-mobile/.output

CMD node apps/front-mobile/.output/server/index.mjs
