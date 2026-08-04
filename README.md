# SATrees Frontend

Angular frontend for the Southern African Trees search application. Search across **1,600+ tree species** using regular expressions in **multiple languages**. Results link to Wikipedia, SANBI, and WFO for detailed information.

> ⚠️ **Data notice:** The tree data is not in the public domain.

## Prerequisites

### Node.js

Node.js 20+ is required. Check your version:

```bash
node --version
```

### Yarn

This project uses **Yarn 4** (Corepack). Enable it if not already:

```bash
corepack enable
```

### GeckoDriver (Firefox testing)

If running automated browser tests, install [GeckoDriver](https://github.com/mozilla/geckodriver) and ensure it's on your `PATH`:

```bash
# Fedora
sudo dnf install geckodriver

# macOS
brew install geckodriver
```

## Installation

Install project dependencies (Angular, libraries, build tools):

```bash
yarn install
```

This installs everything listed in `package.json` into `node_modules/` and creates/updates `.yarn/cache/` and `.pnp.*` files.

> **Note:** Yarn 4 is enforced via the `packageManager` field in `package.json` (`yarn@4.12.0`). If you don't have Corepack enabled, run `corepack enable` first.

### Alternative: npm

You can also use npm if preferred:

```bash
npm install
```

This will use the `yarn.lock` file but may produce a slightly different `node_modules` layout. For consistency with CI and other developers, **Yarn is recommended**.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 21.1.0 (upgraded from Angular 10.2.0) |
| Language | TypeScript |
| Backend | Node.js / Express / Mongoose / MongoDB |

## Quick Start

```bash
./ng_go.sh
```

This starts the dev server on `fedora-msi:4200`. Access the app at:

- **Local machine:** http://localhost:4200/
- **Network:** http://fedora-msi:4200/

## Development Server

| Command | Description |
|---------|-------------|
| `ng serve` | Dev server on `localhost:4200` |
| `./ng_go.sh` | Dev server on `fedora-msi:4200` |
| `ng serve --host 0.0.0.0` | Expose to all network interfaces (requires firewall rules) |

Source files are watched — the app reloads automatically on changes.

## Configuration

### Backend URL

Set the backend API URL in the environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  SATreesUrl: 'http://localhost:5002/api',
};
```

The backend CORS is configured to allow `localhost` origins (`http://localhost:4200`, `http://localhost:5002`), so `localhost` works fine for local development.

> **Note:** Using `localhost` in the environment config is fine for development, but in production the backend typically serves the frontend directly (e.g. via Express `static` middleware), so no CORS configuration is needed.

### Proxy (optional)

If you prefer to proxy API requests through the frontend dev server, create `proxy.json`:

```json
{
  "/api": {
    "target": "http://192.168.0.10:5002",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

Then run:

```bash
ng serve --proxy-config proxy.json
```

Or set `proxyConfig` in `angular.json` under serve options for a permanent setup.

> With backend CORS enabled, the proxy is optional — setting `SATreesUrl` in the environment config is sufficient.

## Build

| Command | Description |
|---------|-------------|
| `ng build` | Production build |
| `ng build --configuration development` | Dev build (no optimization, with source maps) |

Build output is placed in `dist/trees-frontend/`.

## Running in Production

The frontend is a single-page application — in production it is served by the backend (e.g. via Express `static` middleware). The backend typically hosts the built files at the root path.

For **local testing of the production build**, you can serve it with any static file server:

```bash
# Using npx serve (quick local test)
npx serve dist/trees-frontend/

# Or using a simple Python server
python3 -m http.server 8080 -d dist/trees-frontend/
```

> **Note:** You'll need to set the backend URL in `src/environments/environment.prod.ts` before building for production.

## Code Generation

```bash
ng generate component my-component
ng generate service my-service
ng generate directive my-directive
```

See `ng generate --help` for all available schematics.

## Linting

```bash
ng lint TreesFrontend
```

## Unit Tests

Not yet implemented.

## Further Help

- [Angular CLI Overview & Command Reference](https://angular.io/cli)
- Run `ng help` for CLI help
