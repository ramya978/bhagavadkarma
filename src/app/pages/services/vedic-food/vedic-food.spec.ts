import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VedicFood } from './vedic-food';

describe('VedicFood', () => {
  let component: VedicFood;
  let fixture: ComponentFixture<VedicFood>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VedicFood],
    }).compileComponents();

    fixture = TestBed.createComponent(VedicFood);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
