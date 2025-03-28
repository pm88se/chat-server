# 🔨 Build stage
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 🚀 Production stage
FROM node:18 AS production

WORKDIR /app

COPY package*.json ./
# ⛔️ Видаляємо husky prepare, бо dev-залежностей немає
RUN npm pkg delete scripts.prepare && npm install --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main"]
