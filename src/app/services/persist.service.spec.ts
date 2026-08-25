import { TestBed } from '@angular/core/testing';

import { PersistService } from './persist.service';
import { SearchParams } from '../interfaces/search-params';

describe('PersistService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(TestBed.inject(PersistService)).toBeTruthy();
  });

  it('retrieves previously persisted params', () => {
    const service = TestBed.inject(PersistService);
    const params: SearchParams = {
      language: 'Zul',
      searchterm: 'kloof',
      group: '1',
      genus: 'Pine',
      family: 'aceae',
    };
    service.persist(params);

    expect(service.retrieve()).toEqual(params);
  });

  it('returns null when nothing has been persisted', () => {
    const service = TestBed.inject(PersistService);

    expect(service.retrieve()).toBeNull();
  });

  it('returns null for wrong-shaped data in localStorage', () => {
    localStorage.setItem('SearchParams', '{"foo": 1}');
    const service = TestBed.inject(PersistService);

    expect(service.retrieve()).toBeNull();
  });

  it('returns null for corrupt (non-JSON) data in localStorage', () => {
    localStorage.setItem('SearchParams', 'not-json{{{');
    const service = TestBed.inject(PersistService);

    expect(service.retrieve()).toBeNull();
  });
});
