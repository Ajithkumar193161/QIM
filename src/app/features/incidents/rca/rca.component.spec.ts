import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcaComponent } from './rca.component';

describe('RcaComponent', () => {
  let component: RcaComponent;
  let fixture: ComponentFixture<RcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RcaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
