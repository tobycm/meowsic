FROM oven/bun:alpine

WORKDIR /app

# Install dependencies
COPY package.json bun.lock* ./

RUN bun install

COPY . .

EXPOSE 3456

CMD ["bun", "run", "start"]
