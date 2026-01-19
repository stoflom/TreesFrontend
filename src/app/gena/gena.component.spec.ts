import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenaComponent } from './gena.component';

describe('GenaComponent', () => {
  let component: GenaComponent;
  let fixture: ComponentFixture<GenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
