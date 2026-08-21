import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { GenusComponent } from './genus.component';

describe('GenusComponent', () => {
  let component: GenusComponent;
  let fixture: ComponentFixture<GenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenusComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map<string, string>([['name', 'test']]) },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(GenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
