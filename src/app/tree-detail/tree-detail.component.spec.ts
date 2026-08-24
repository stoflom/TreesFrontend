import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { TreeDetailComponent } from './tree-detail.component';

describe('TreeDetailComponent', () => {
  let component: TreeDetailComponent;
  let fixture: ComponentFixture<TreeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeDetailComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map<string, string>([['id', 'test']]) },
            paramMap: of(new Map<string, string>([['id', 'test']])),
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
