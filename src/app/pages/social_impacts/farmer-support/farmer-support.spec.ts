import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmerSupport } from './farmer-support';

describe('FarmerSupport', () => {
  let component: FarmerSupport;
  let fixture: ComponentFixture<FarmerSupport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmerSupport],
    }).compileComponents();

    fixture = TestBed.createComponent(FarmerSupport);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
