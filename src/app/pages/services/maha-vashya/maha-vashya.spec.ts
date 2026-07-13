import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MahaVashya } from './maha-vashya';

describe('MahaVashya', () => {
  let component: MahaVashya;
  let fixture: ComponentFixture<MahaVashya>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MahaVashya],
    }).compileComponents();

    fixture = TestBed.createComponent(MahaVashya);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
