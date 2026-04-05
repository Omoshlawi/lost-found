# Mantine Vite template

## Features

This template comes with the following features:

- [PostCSS](https://postcss.org/) with [mantine-postcss-preset](https://mantine.dev/styles/postcss-preset)
- [TypeScript](https://www.typescriptlang.org/)
- [Storybook](https://storybook.js.org/)
- [Vitest](https://vitest.dev/) setup with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)
- ESLint setup with [eslint-config-mantine](https://github.com/mantinedev/eslint-config-mantine)

## npm scripts

## Build and dev scripts

- `dev` – start development server
- `build` – build production version of the app
- `preview` – locally preview production build

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `vitest` – runs vitest tests
- `vitest:watch` – starts vitest watch
- `test` – runs `vitest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier

## Docker Setup Guide

This application is containerized utilizing a multi-stage Docker build, serving the optimized Vite production bundle via an Nginx web server.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- Docker Compose V2

### Running the Application

You can easily spin up the container network locally using Docker Compose:

```bash
# Build the image and start the container in detached mode
docker compose up --build -d
```

Once running, the application will be predictably available at: **http://localhost:8080**

### Stopping the Application

To safely shut down and remove the container, run:

```bash
docker compose down
```

### Proxy Configuration Notes

Since this image serves pre-built static files, the Vite proxy (`vite.config.mjs`) is intentionally bypassed. Instead, the application's `nginx.conf` acts as a reverse proxy matching the development configuration. Requests targeting `/api` or `/socket.io` are gracefully routed to the respective backend servers without triggering cross-origin errors.
