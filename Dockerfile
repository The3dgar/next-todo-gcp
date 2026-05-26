# Stage 1 - dependencies
FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --frozen-lockfile

# Stage 2 - builder
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Genera el cliente de Prisma (necesita schema.prisma)
RUN npx prisma generate

RUN npm run build

# Stage 3 - runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Usuario no-root por seguridad (recomendado en GCP)
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Archivos de Next.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Regenera binarios nativos de Prisma para este entorno Alpine
RUN npx prisma generate

USER nextjs

EXPOSE 8080

# Corre migraciones y luego inicia la app
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
