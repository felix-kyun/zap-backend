FROM node:24-alpine AS builder

## setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# build
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

EXPOSE 3000
CMD ["pnpm", "dev"]
