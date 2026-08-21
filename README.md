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

### Firefox (unit tests)

Unit tests run in a headless **Firefox** browser via Karma. Install Firefox if not already present:

```bash
# Fedora
sudo dnf install firefox
```

### GeckoDriver (optional, Selenium-based browser testing only)

Only needed if you run automated browser tests through Selenium/Marionette — **not** required for the Karma unit tests below. If you do, install [GeckoDriver](https://github.com/mozilla/geckodriver) and ensure it's on your `PATH`:

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
| Framework | Angular 22.1 (standalone components, `@Service()` decorator) |
| Language | TypeScript 6.0 |
| Testing | Karma + Jasmine (headless Firefox) |

## Quick Start

### Full Application (Recommended)

```bash
# From the repository root
./start.sh
```

This builds the Angular frontend and starts the Deno backend on port **5002**. The backend serves the built frontend from `TreesFrontend/dist/trees-frontend/browser` statically, so the app is available at http://localhost:5002/.

### Frontend Dev Server Only

```bash
ng serve --proxy-config proxy.json
```

This starts the Angular dev server on `localhost:4200` and proxies `/api/*` requests to the backend (see [Proxy](#proxy)). Access the app at:

- **Local machine:** http://localhost:4200/

> The backend must be running (see `TreesBackend/deno_go.sh` or `deno task start`).

## Development Server

| Command | Description |
|---------|-------------|
| `ng serve --proxy-config proxy.json` | Dev server on `localhost:4200` with API proxy |
| `ng serve --host 0.0.0.0 --proxy-config proxy.json` | Expose to all network interfaces (requires firewall rules) |

Source files are watched — the app reloads automatically on changes.

## Configuration

### Backend URL

The services use the **relative** API path `/api` (see `TreehttpService` and `VersionService`). This works in both setups without configuration:

- **Production:** the backend serves the frontend, so `/api` resolves to the same origin.
- **Development:** the dev server proxies `/api` to the backend (see below).

> **Note:** `src/environments/environment.ts` / `environment.prod.ts` still exist but are **not currently used** by any code.

### Proxy

`proxy.json` routes `/api` requests from the dev server to the backend:

```json
{
  "/api": {
    "target": "http://192.168.0.9:5002",
    "secure": false,
    "logLevel": "debug",
    "changeOrigin": true
  }
}
```

The `target` must point at a running backend (currently `fedora-nuc`, `192.168.0.9`). Run:

```bash
ng serve --proxy-config proxy.json
```

> The proxy is required for development because the app calls the API with relative paths.

## Build

| Command | Description |
|---------|-------------|
| `ng build` | Production build |
| `ng build --configuration development` | Dev build (no optimization, with source maps) |
| `deno task build:frontend` | Build from backend directory |

Build output is placed in `dist/trees-frontend/`.

## Production

In production, the frontend is built and served statically by the Deno backend on port **5002**. No separate frontend server is needed.

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

Unit tests use **Karma + Jasmine** and run in a headless **Firefox** browser (via `karma-firefox-launcher`).

```bash
# Run once and exit
yarn test --watch=false

# Run in watch mode (default)
yarn test
```

Configuration lives in [`karma.conf.js`](karma.conf.js):

- `browsers: ['FirefoxHeadless']` — no display server required.
- `frameworks: ['jasmine']` — the `@angular/build:karma` builder injects its own asset/polyfill plugins, so no Angular framework plugin is listed in the config.
- Coverage reporter outputs to `coverage/trees-frontend/` when enabled.

Requirements:

- Firefox installed (see [Prerequisites](#firefox-unit-tests)).
- No backend or database needed — components are tested with `provideHttpClient()`, `provideRouter([])` and stubbed `ActivatedRoute` providers, so HTTP calls fail safely and are caught by the services.

Current coverage: all services (`MessageService`, `PersistService`, `TreehttpService`) and all components have "should create" specs.

## Further Help

- [Angular CLI Overview & Command Reference](https://angular.io/cli)
- [Angular 22 `@Service` decorator](https://angular.dev/basics/di)
- Run `ng help` for CLI help
