# syntax=docker.io/docker/dockerfile:1

FROM node:22-slim AS base

# install dependencies & build
FROM base AS builder
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build:standalone

# runner
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/data ./data
RUN mkdir .next
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_NO_WARNINGS=1
EXPOSE 3000
CMD node scripts/init.js & node server.js
