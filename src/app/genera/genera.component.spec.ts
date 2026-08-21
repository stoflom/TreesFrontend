import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { GeneraComponent } from './genera.component';

describe('GeneraComponent', () => {
  let component: GeneraComponent;
  let fixture: ComponentFixture<GeneraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneraComponent],
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

    fixture = TestBed.createComponent(GeneraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
