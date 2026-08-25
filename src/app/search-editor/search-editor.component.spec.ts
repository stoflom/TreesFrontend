import { Component } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';

import { SearchEditorComponent } from './search-editor.component';
import { PersistService } from '../services/persist.service';
import { SearchParams } from '../interfaces/search-params';

/** Stand-in for the target pages so navigation succeeds in tests. */
@Component({ selector: 'app-dummy-dest', template: '' })
class DummyDestination {}

const ROUTES: Routes = [
  { path: 'trees/:language/:nameregex', component: DummyDestination },
  { path: 'group/:group', component: DummyDestination },
  { path: 'genus_regex/:name', component: DummyDestination },
  { path: 'family_regex/:name', component: DummyDestination },
];

const DEFAULTS: SearchParams = {
  language: 'Eng',
  searchterm: 'wood†?$',
  group: '1',
  genus: '^A',
  family: 'ceae$',
};

interface Harness {
  component: SearchEditorComponent;
  fixture: ComponentFixture<SearchEditorComponent>;
  router: Router;
  persisted: SearchParams[];
}

async function create(retrieved: SearchParams | null): Promise<Harness> {
  const persisted: SearchParams[] = [];

  await TestBed.configureTestingModule({
    imports: [SearchEditorComponent],
    providers: [
      provideZonelessChangeDetection(),
      provideRouter(ROUTES),
      {
        provide: PersistService,
        useValue: {
          retrieve: () => retrieved,
          persist: (params: SearchParams) => persisted.push({ ...params }),
        },
      },
    ],
  });

  const fixture = TestBed.createComponent(SearchEditorComponent);
  fixture.detectChanges(); // runs ngOnInit -> retrieve + reset
  return {
    component: fixture.componentInstance,
    fixture,
    router: TestBed.inject(Router),
    persisted,
  };
}

describe('SearchEditorComponent', () => {
  it('restores persisted search params into the forms on init', async () => {
    const { component } = await create({
      language: 'Zul',
      searchterm: 'kloof',
      group: '7',
      genus: 'Pine',
      family: 'aceae',
    });

    expect(component.searchlnregexFG.value.language).toBe('Zul');
    expect(component.searchlnregexFG.value.searchterm).toBe('kloof');
    expect(component.searchgroupFG.value.group).toBe('7');
    expect(component.searchgenusFG.value.genus).toBe('Pine');
    expect(component.searchfamilyFG.value.family).toBe('aceae');
  });

  it('falls back to defaults when nothing is persisted', async () => {
    const { component } = await create(null);

    expect(component.searchlnregexFG.value.language).toBe(DEFAULTS.language);
    expect(component.searchlnregexFG.value.searchterm).toBe(DEFAULTS.searchterm);
    expect(component.searchgroupFG.value.group).toBe(DEFAULTS.group);
    expect(component.searchgenusFG.value.genus).toBe(DEFAULTS.genus);
    expect(component.searchfamilyFG.value.family).toBe(DEFAULTS.family);
  });

  it('name search: persists params and navigates to /trees/:language/:term', async () => {
    const { component, fixture, router, persisted } = await create(null);

    component.searchlnregexFG.controls.language.setValue('Zul');
    component.searchlnregexFG.controls.searchterm.setValue('kloof');
    component.onSubmitsearchlnregexFG();
    await fixture.whenStable();

    expect(router.url).toBe('/trees/Zul/kloof');
    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toMatchObject({ language: 'Zul', searchterm: 'kloof' });
  });

  it('group search: persists params and navigates to /group/:group', async () => {
    const { component, fixture, router, persisted } = await create(null);

    component.searchgroupFG.controls.group.setValue('7');
    component.onSubmitsearchgroupFG();
    await fixture.whenStable();

    expect(router.url).toBe('/group/7');
    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toMatchObject({ group: '7' });
  });

  it('genus search: persists params and navigates to /genus_regex/:name', async () => {
    const { component, fixture, router, persisted } = await create(null);

    component.searchgenusFG.controls.genus.setValue('Pine');
    component.onSubmitsearchgenusFG();
    await fixture.whenStable();

    expect(router.url).toBe('/genus_regex/Pine');
    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toMatchObject({ genus: 'Pine' });
  });

  it('family search: persists params and navigates to /family_regex/:name', async () => {
    const { component, fixture, router, persisted } = await create(null);

    component.searchfamilyFG.controls.family.setValue('aceae');
    component.onSubmitsearchfamilyFG();
    await fixture.whenStable();

    expect(router.url).toBe('/family_regex/aceae');
    expect(persisted).toHaveLength(1);
    expect(persisted[0]).toMatchObject({ family: 'aceae' });
  });
});
