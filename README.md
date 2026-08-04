# SATrees Frontend

Application to search with regular expressions for common names of 1600 Southern African Trees in many languages. Links are provided to Wikipedia, SANBI and WFO sites where more details can be found. The data is retrieved by a Node.js/Express/Mongoose/MongoDB backend. The data is not in the public domain.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0 and has been upgraded to version 21.1.0.

## Quick start

```bash
./ng_go.sh
```

This runs `ng serve --host fedora-msi`. Navigate to `http://fedora-msi:4200/` (or `http://localhost:4200/` from the same machine) to access the app.

## Development server

Run `ng serve` for a dev server. The app will automatically reload if you change any source files.

| Command | Description |
|---------|-------------|
| `ng serve` | Start dev server on `localhost:4200` |
| `./ng_go.sh` | Start dev server on `fedora-msi:4200` |
| `ng serve --host 0.0.0.0` | Expose to all network interfaces (requires firewall rules) |

## Configuring the backend URL

The backend URL is configured in `src/environments/environment.ts` (development) and `src/environments/environment.prod.ts` (production):

```typescript
// src/environments/environment.ts
export const environment = {
  SATreesUrl: 'http://192.168.0.8:5002/api',
};
```

Change `SATreesUrl` to point at your backend server. **The backend cannot be accessed via `localhost` — an IP address or hostname is required** because CORS is configured on the backend to only accept requests from specific origins.

### Proxy server (optional)

If you prefer to proxy API requests through the frontend dev server instead of direct backend access, create a `proxy.json` file:

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

Then start the dev server with:

```bash
ng serve --proxy-config proxy.json
```

Alternatively, set `proxyConfig` in `angular.json` under the `serve` options so it applies automatically.

> **Note:** With CORS enabled on the backend, the proxy is not required — just set the backend URL in `src/environments/environment.ts`.

## Build

Run `ng build` to build the project. Build artifacts are stored in the `dist/trees-frontend/` directory.

| Command | Description |
|---------|-------------|
| `ng build` | Build with production configuration |
| `ng build --configuration development` | Build with development settings (no optimization, source maps) |

## Lint

Run `ng lint TreesFrontend` to check for code quality issues.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also generate `directive`, `pipe`, `service`, `guard`, `interface`, `enum`, or `module`.

```bash
ng generate component my-new-component
```

See `ng generate --help` for all available options.

## Running unit tests

Not implemented yet.

## Further help

For more help on the Angular CLI, run `ng help` or visit the [Angular CLI Overview and Command Reference](https://angular.io/cli).
