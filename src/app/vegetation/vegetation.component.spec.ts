import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vegetation } from './vegetation';

describe('Vegetation', () => {
  let component: Vegetation;
  let fixture: ComponentFixture<Vegetation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vegetation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vegetation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
