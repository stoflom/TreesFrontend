import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { Vegetation } from './vegetation.component';

describe('Vegetation', () => {
  let component: Vegetation;
  let fixture: ComponentFixture<Vegetation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vegetation],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map<string, string>() },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(Vegetation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
