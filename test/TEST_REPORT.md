# Test Report — Angular 22 Upgrade

Date: 2026-08-21
Branch: `upgrade` (TreesFrontend)
Environment: frontend dev server `localhost:4200` (Vite, `--proxy-config proxy.json`), backend on `fedora-nuc:5002` (192.168.0.9), MongoDB on `fedora-nuc:27017`.

## Test harness

### Unit tests (Karma)

- `karma.conf.js` (new) + `karma-firefox-launcher` (new dev dependency), browser `FirefoxHeadless` — no display server needed.
- `frameworks: ['jasmine']` only; the `@angular/build:karma` builder injects its own asset/polyfill plugins (a `@angular/build` framework entry is *not* valid and fails with `No provider for "framework:@angular/build"`).
- Run: `yarn test --watch=false` (single run) or `yarn test` (watch).
- Spec fixes made along the way:
  - `vegetation.component.spec.ts` imported `./vegetation` (nonexistent) — corrected to `./vegetation.component`.
  - Component specs now provide `provideRouter([])`, `provideHttpClient()` and a stubbed `ActivatedRoute` (with `paramMap` values where the service would otherwise crash on `null.trim()`).
  - `AppComponent` spec updated to the real title (was the stale `TreesFrontend` boilerplate).
  - Deprecated `compileComponents()` calls removed.
- Component bugs exposed by the specs and fixed:
  - `TreesComponent.trees`, `GeneraComponent.Genera`, `FamiliesComponent.Families`: `{} as T[]` → `[]`. The empty object passed the `@if` truthy check and crashed the `@for` repeater (`newCollection[Symbol.iterator] is not a function`).
  - `TreeDetailComponent.atree`: `{} as ITreeDocument` → `ITreeDocument | undefined` (template already guards with `@if (atree)`).

### Browser smoke test (Selenium / Marionette)

- `test/smoke_test.py` — headless Firefox via the `firefox-testing` skill (`FirefoxTester`).
- Installs a console + XHR network hook after the initial page load; because the app is an SPA, router navigation keeps the hook alive, so console errors and API calls during the run are captured and printed at the end (debug console access).
- Run: `python3 test/smoke_test.py [base_url]` (default `http://localhost:4200`).

## What is working

| Area | Status | Evidence |
|------|--------|----------|
| Angular 22.1.3 build (`ng build`) | ✅ | bundle generated, no errors |
| Lint (`ng lint`) | ✅ | all files pass |
| Unit tests | ✅ | **14/14 SUCCESS** in FirefoxHeadless |
| `@Service()` decorator | ✅ | all 4 services (`Message`, `Persist`, `Treehttp`, `Version`) use `@Service()` — root singletons, replacing `@Injectable({providedIn:'root'})` |
| API via dev-server proxy (curl) | ✅ | `/api/version` → `{"version":"1.1.2"}`; `/api/id/…`, `/api/treegs/acacia/karroo`, `/api/treegenus/adenia`, `/api/treesjq` (POST), `/api/cnlan/Eng/marula` (6), `/api/cnlan/Eng/wood†?$` (212), `/api/cnlan/Afr/klimop` (25), `/api/genus/regex/^A` (45), `/api/family/regex/ceae$` (132) |
| Browser: app boot | ✅ | redirects to `/search`, title renders (headless + real browser) |
| Browser: version header | ✅ real browser / ❌ headless | shows `1.1.2` in the developer's browser; **empty in headless Marionette Firefox** (see below) |
| Browser: family regex search | ✅ real browser / ❌ headless | data displayed in the developer's browser; `Found 0 Families` in headless |

## What is NOT working (unresolved)

1. **Headless Firefox (smoke test): no search data, empty version header.**
   All results pages show `Found 0 …`; the version header stays empty. The captured network hook shows **no XHRs issued by the app at all** after navigation, while a manual `XMLHttpRequest` from the page console to `/api/version` succeeds (200). No console errors are captured.
2. **Real browser: name and genus searches show no data** (family search does). Same "Found 0" symptom, no console errors.
3. The `FamiliesComponent` initial-render repeater crash (seen in the real-browser debug console) is fixed in code but **not yet re-verified in a browser**.

### Observations (unverified hypotheses)

- The services return `of([])` without any HTTP call when the route param is empty (`!param.trim()`). `Found 0` with zero XHRs is exactly that path — i.e. the components may be seeing **empty route params** in these flows. Root cause not established (further Angular-internal debugging was stopped on request).
- In headless, even the boot-time `/api/version` request appears to have no effect on the view, although the same request succeeds when issued manually from the page.

## Environment notes

- `proxy.json` target changed to `http://192.168.0.9:5002` (fedora-nuc) — kept per maintainer decision.
- `TreesBackend/.env` `MONGODB_URI` now points at `fedora-nuc:27017` (gitignored file, local only).
- A temporary local backend (`systemd --user` unit `trees-backend`) was started during testing and stopped again; the backend of record runs on fedora-nuc.

## Suggested next steps

1. Verify the `FamiliesComponent` fix in a real browser (family regex search should no longer log repeater errors).
2. Instrument `TreesComponent`/`GeneraComponent` `ngOnInit` (temporary logs) to confirm what `paramMap` values arrive when the "Found 0" pages render.
3. Once the data-display issue is fixed, re-run `python3 test/smoke_test.py` — all six checks should pass.
