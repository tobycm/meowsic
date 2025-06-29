FROM oven/bun:alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./

RUN bun install

COPY . .

RUN bun run build

# Use a lightweight server to serve the built application
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
