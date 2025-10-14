FROM node:20-alpine AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

# Copia arquivos de dependência
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Instala dependências e gera Prisma
RUN npm ci && npx prisma generate

# Copia o restante do código
COPY . .

# Build da aplicação
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup -g 1001 -S nextjs && \
    adduser -S nextjs -u 1001 -G nextjs

# Copia apenas o necessário
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder --chown=nextjs:nextjs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./

USER nextjs

EXPOSE 3000
CMD ["npm", "start"]