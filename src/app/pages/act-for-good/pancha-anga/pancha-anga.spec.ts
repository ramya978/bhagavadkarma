import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanchaAnga } from './pancha-anga';

describe('PanchaAnga', () => {
  let component: PanchaAnga;
  let fixture: ComponentFixture<PanchaAnga>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanchaAnga],
    }).compileComponents();

    fixture = TestBed.createComponent(PanchaAnga);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
