import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalWellness } from './physical-wellness';

describe('PhysicalWellness', () => {
  let component: PhysicalWellness;
  let fixture: ComponentFixture<PhysicalWellness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalWellness],
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicalWellness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
