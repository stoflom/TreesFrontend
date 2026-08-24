import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { FamilyComponent } from './family.component';

describe('FamilyComponent', () => {
  let component: FamilyComponent;
  let fixture: ComponentFixture<FamilyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map<string, string>() },
            paramMap: of(new Map<string, string>()),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(FamilyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
