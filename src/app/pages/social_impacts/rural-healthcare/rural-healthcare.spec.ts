import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuralHealthcare } from './rural-healthcare';

describe('RuralHealthcare', () => {
  let component: RuralHealthcare;
  let fixture: ComponentFixture<RuralHealthcare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuralHealthcare],
    }).compileComponents();

    fixture = TestBed.createComponent(RuralHealthcare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
