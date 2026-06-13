FROM node:20-alpine AS builder

WORKDIR /app
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN cd backend && npm install && cd ../frontend && npm install

COPY backend/prisma ./backend/prisma/
COPY backend/src ./backend/src/
COPY backend/tsconfig.json ./backend/
COPY frontend/ ./frontend/

RUN cd frontend && npm run build
RUN cd backend && npx prisma generate

FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache postgresql-client

COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/prisma ./backend/prisma/
COPY --from=builder /app/backend/dist ./backend/dist/
COPY --from=builder /app/frontend/dist ./frontend/dist/
COPY --from=builder /app/backend/src ./backend/src/
COPY --from=builder /app/backend/tsconfig.json ./backend/

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD cd backend && npx prisma migrate deploy && npx prisma generate && npx tsx src/index.ts
