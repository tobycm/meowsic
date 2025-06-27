FROM oven/bun:alpine

WORKDIR /app

VOLUME [ "/data" ]

# install ffprobe

RUN apk update

RUN apk add --no-cache ffmpeg vips

# Install dependencies
COPY package.json bun.lock* ./

RUN bun install

COPY . .

EXPOSE 3457

CMD ["bun", "run", "start"]
