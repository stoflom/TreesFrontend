import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { TreesComponent } from './trees.component';

describe('TreesComponent', () => {
  let component: TreesComponent;
  let fixture: ComponentFixture<TreesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreesComponent],
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

    fixture = TestBed.createComponent(TreesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
