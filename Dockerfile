FROM node:20-alpine AS builder

# Configurações de ambiente de build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

# Cria o diretório de trabalho com um usuário não-root
RUN chown -R node:node /app
USER node

# Copia apenas os arquivos de dependência 
COPY package.json package-lock.json ./

# Instala as dependências (ci é mais confiável para build)
RUN npm ci

# Copia o restante do código
COPY . .

# Geração do cliente Prisma e build do Next
COPY prisma ./prisma/

USER root
RUN npx prisma generate
USER node

# Builda o Next
RUN npm run build

FROM node:20-alpine

# Configurações de ambiente de produção
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

# Configura o diretório de trabalho
WORKDIR /app

# Cria o grupo e o usuário nextjs para seguir a documentação oficial
RUN addgroup -g 1001 -S nextjs
RUN adduser -S nextjs -u 1001 -G nextjs

# Define o usuário nextjs como dono dos diretórios
RUN mkdir -p /app
RUN chown -R nextjs:nextjs /app

# Copia o necessário da etapa de build
COPY --from=builder --chown=nextjs:nextjs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nextjs /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nextjs:nextjs /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nextjs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules 

# Define o usuário para execução (muito importante para segurança)
USER nextjs

# Porta padrão
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "start"] 