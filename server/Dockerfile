FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
COPY prisma.config.ts ./

RUN npm ci
RUN npm run prisma:generate
RUN npm run build


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm ci
RUN npm run prisma:generate

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/assets ./src/assets

RUN mkdir -p uploads

EXPOSE 8000

CMD ["node", "dist/index.js"]