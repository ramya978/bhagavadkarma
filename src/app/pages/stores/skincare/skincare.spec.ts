import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Skincare } from './skincare';

describe('Skincare', () => {
  let component: Skincare;
  let fixture: ComponentFixture<Skincare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skincare],
    }).compileComponents();

    fixture = TestBed.createComponent(Skincare);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
