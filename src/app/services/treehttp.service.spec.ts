import { TestBed } from '@angular/core/testing';

import { TreehttpService } from './treehttp.service';

describe('TreehttpService', () => {
  let service: TreehttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreehttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
