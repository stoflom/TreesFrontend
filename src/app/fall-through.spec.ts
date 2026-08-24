import { Component, ApplicationRef, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router, RouterOutlet } from '@angular/router';

import { FamiliesComponent } from './families/families.component';
import { GeneraComponent } from './genera/genera.component';
import { TreesComponent } from './trees/trees.component';
import { IFamilyDocument } from './interfaces/family';
import { IGenusDocument } from './interfaces/genus';
import { ITreeDocument } from './interfaces/tree';

/**
 * Regression tests for the "fall-through to detail page when a list query
 * returns exactly one result" behaviour (families, genera and trees lists).
 *
 * The fall-through used to run inside the HttpClient subscribe callback;
 * since the signals/httpResource migration it lives in an effect() that
 * watches the resource value.
 */

const FAMILY: IFamilyDocument = { id: 'f1', name: 'Fabaceae' };
const GENUS: IGenusDocument = { id: 'g1', name: 'Acacia' };
// A minimal tree document; only `id` is needed by the fall-through.
const TREE: ITreeDocument = { id: 't1' } as ITreeDocument;

@Component({ selector: 'app-dummy-family', template: '' })
class DummyFamilyComponent {}

@Component({ selector: 'app-dummy-genus', template: '' })
class DummyGenusComponent {}

@Component({ selector: 'app-dummy-tree-detail', template: '' })
class DummyTreeDetailComponent {}

@Component({
  selector: 'app-test-host',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
class TestHost {}

function testRoutes() {
  return [
    { path: 'family_regex/:name', component: FamiliesComponent },
    { path: 'family/:name', component: DummyFamilyComponent },
    { path: 'genus_regex/:name', component: GeneraComponent },
    { path: 'genus/:name', component: DummyGenusComponent },
    { path: 'trees/:language/:nameregex', component: TreesComponent },
    { path: 'group/:group', component: TreesComponent },
    { path: 'detail/:id', component: DummyTreeDetailComponent },
  ];
}

async function setupAndNavigate(path: string[]) {
  await TestBed.configureTestingModule({
    imports: [TestHost],
    providers: [provideZonelessChangeDetection(), provideRouter(testRoutes()), provideHttpClient(), provideHttpClientTesting()],
  }).compileComponents();

  const router = TestBed.inject(Router);
  const appRef = TestBed.inject(ApplicationRef);

  await TestBed.createComponent(TestHost).whenStable();
  const nav = await router.navigate(path);
  expect(nav).toBe(true);
  TestBed.tick();

  return { router, appRef, httpMock: TestBed.inject(HttpTestingController) };
}

/** Flush pending microtasks/macrotasks and change detection so effects and navigation settle. */
async function settle(appRef: ApplicationRef) {
  for (let i = 0; i < 20; i++) {
    await Promise.resolve();
    await new Promise((r) => setTimeout(r));
    TestBed.tick();
  }
  await appRef.whenStable();
  TestBed.tick();
}

describe('fall-through to detail page on single search result', () => {
  afterEach(() => TestBed.inject(HttpTestingController).verify());

  describe('FamiliesComponent (/family_regex/:name)', () => {
    it('navigates to /family/:name when exactly one family matches', async () => {
      const { router, appRef, httpMock } = await setupAndNavigate(['/family_regex', 'ceae$']);

      httpMock.expectOne((r) => r.url.includes('/family/regex/')).flush([FAMILY]);
      await settle(appRef);

      expect(router.url).toBe('/family/Fabaceae');
    });

    it('stays on the list when more than one family matches', async () => {
      const { router, appRef, httpMock } = await setupAndNavigate(['/family_regex', 'ceae$']);

      httpMock.expectOne((r) => r.url.includes('/family/regex/')).flush([FAMILY, { ...FAMILY, name: 'Myrtaceae' }]);
      await settle(appRef);

      expect(router.url).not.toBe('/family/Fabaceae');
    });

    it('stays on the list when no family matches', async () => {
      const { router, appRef, httpMock } = await setupAndNavigate(['/family_regex', 'zzzz$']);

      httpMock.expectOne((r) => r.url.includes('/family/regex/')).flush([]);
      await settle(appRef);

      expect(router.url).toContain('/family_regex/');
    });
  });

  describe('GeneraComponent (/genus_regex/:name)', () => {
    it('navigates to /genus/:name when exactly one genus matches', async () => {
      const { router, appRef, httpMock } = await setupAndNavigate(['/genus_regex', '^Aca']);

      httpMock.expectOne((r) => r.url.includes('/genus/regex/')).flush([GENUS]);
      await settle(appRef);

      expect(router.url).toBe('/genus/Acacia');
    });

    it('stays on the list when more than one genus matches', async () => {
      const { router, appRef, httpMock } = await setupAndNavigate(['/genus_regex', '^A']);

      httpMock.expectOne((r) => r.url.includes('/genus/regex/')).flush([GENUS, { ...GENUS, name: 'Allocasuarina' }]);
      await settle(appRef);

      expect(router.url).not.toBe('/genus/Acacia');
    });
  });

  describe('TreesComponent (/trees/:language/:nameregex and /group/:group)', () => {
    it('navigates to /detail/:id when exactly one tree matches the common-name search', async () => {
      const { router, appRef, httpMock } = await setupAndNavigate(['/trees', 'Eng', 'wood†']);

      httpMock.expectOne((r) => r.url.includes('/cnlan/')).flush([TREE]);
      await settle(appRef);

      expect(router.url).toBe('/detail/t1');
    });

    it('navigates to /detail/:id when exactly one tree matches the group search', async () => {
      const { router, appRef, httpMock } = await setupAndNavigate(['/group', '1']);

      httpMock.expectOne((r) => r.url.includes('/group/')).flush([TREE]);
      await settle(appRef);

      expect(router.url).toBe('/detail/t1');
    });

    it('stays on the list when more than one tree matches', async () => {
      const { router, appRef, httpMock } = await setupAndNavigate(['/group', '1']);

      httpMock.expectOne((r) => r.url.includes('/group/')).flush([TREE, { ...TREE, id: 't2' }]);
      await settle(appRef);

      expect(router.url).not.toBe('/detail/t1');
    });
  });
});
