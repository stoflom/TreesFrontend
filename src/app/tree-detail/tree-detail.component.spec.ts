import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { TreeDetailComponent } from './tree-detail.component';

describe('TreeDetailComponent', () => {
  let component: TreeDetailComponent;
  let fixture: ComponentFixture<TreeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map<string, string>([['id', 'test']]) },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(TreeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
