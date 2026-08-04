# SATrees Frontend

Angular-based frontend for the SATrees backend API.

## Configuration

### Backend Server URL

The backend server hostname is configured via a `.env` file. Copy the example and update with your backend URL:

```bash
cp .env.example .env
```

Then edit `.env` to set the correct backend address:

```env
BACKEND_URL=http://your-backend-host:5002
```

The frontend will automatically append `/api` to the configured URL for all API requests.

> **Note:** If you're using `localhost` for development, you can either:
> - Set `BACKEND_URL=http://localhost:5002` and use the `proxy.json` configuration (see below)
> - Or point directly to your backend host if CORS is enabled

### Proxy Configuration (Optional)

When developing with `localhost`, you can use the Angular proxy to avoid CORS issues. The `proxy.json` file routes `/api` requests to the backend:

```bash
ng serve --proxy-config proxy.json
```

Or configure it directly in `angular.json`. See the [Angular proxy docs](https://angular.io/guide/build#proxying-to-a-backend-server) for details.

> **Note:** CORS should be configured on the backend server. If CORS is enabled, the proxy is not required.

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng serve --host 0.0.0.0` for debug access from outside localhost. (Firewall must be opened first.)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--configuration production` flag for a production build.

## Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Lint

Run `ng lint` to lint the project.

## Testing

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Project Structure

- `src/app/services/treehttp.service.ts` - Main API service for communicating with the backend
- `src/environments/environment.ts` - Environment configuration (reads from `.env`)
- `proxy.json` - Development proxy configuration for backend API routes

## Dependencies

- Angular 21
- ngx-cookie-service for cookie management
