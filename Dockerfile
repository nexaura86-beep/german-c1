# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm install --prefix server --production=false
RUN npm install --prefix client --production=false

COPY client ./client
COPY server ./server

RUN npm run build --prefix client

# Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist

ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server/server.js"]
