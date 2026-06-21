# Dockerfile

# ---- Fase 1: dependencies installeren ----
FROM node:20-alpine AS deps
WORKDIR /app

# OpenSSL is nodig zodat Prisma de juiste engine-binary kan detecteren/uitvoeren
RUN apk add --no-cache openssl

# Alleen package-bestanden kopiëren zodat Docker dependency-installs cached
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm install

# ---- Fase 2: bouwen ----
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Dummy DATABASE_URL zodat 'prisma generate' tijdens build niet faalt
# (de echte URL komt op runtime uit docker-compose)
ENV DATABASE_URL="file:./dev.db"
RUN npx prisma generate
RUN npm run build

# ---- Fase 3: productie-image (zo klein mogelijk) ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# OpenSSL vereist op runtime: Prisma query-engine is dynamisch gelinkt
RUN apk add --no-cache openssl

# Niet als root draaien
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Map voor de SQLite-database (komt overeen met het volume in docker-compose.yml)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Next.js 'standalone' output bevat alleen wat nodig is om te draaien
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Prisma-bestanden: allemaal eigendom van nextjs:nodejs zodat de niet-root
# gebruiker er in mag schrijven (o.a. /app/node_modules/@prisma/engines)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.bin ./node_modules/.bin
COPY --from=builder --chown=nextjs:nodejs /app/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
