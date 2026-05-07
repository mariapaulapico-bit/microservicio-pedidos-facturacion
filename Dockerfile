# ============================================
# Dockerfile - Microservicio Pedidos y Facturación
# ============================================

# ---- Etapa 1: dependencias ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Etapa 2: imagen final ----
FROM node:22-alpine
WORKDIR /app

# Crear usuario no-root por seguridad
RUN addgroup -S app && adduser -S app -G app

# Copiar dependencias y código
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=app:app . .

# Crear carpeta de base de datos con permisos
RUN mkdir -p /app/database && chown -R app:app /app/database

USER app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Healthcheck nativo de Docker
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
