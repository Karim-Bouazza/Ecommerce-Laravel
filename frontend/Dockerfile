# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
# Some npm prebuilds (SWC, sharp) expect glibc symbols; libc6-compat provides them.
RUN apk add --no-cache libc6-compat
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

# --- deps: the full dependency tree, shared by development and build ---
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- development: hot reload. Source is bind-mounted over /app by compose. ---
FROM deps AS development
ENV NODE_ENV=development
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- build: produces .next/standalone ---
FROM deps AS build
# NEXT_PUBLIC_* is inlined into the client bundle at build time, and next.config.ts
# also reads this value to derive images.remotePatterns. It must therefore be the
# browser-reachable public URL (https://api.example.com), never an internal
# compose service name — the browser, not the container, resolves it.
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN npm run build

# --- production: standalone server only, no node_modules install ---
FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.js"]