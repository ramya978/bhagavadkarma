import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LittleDiamond } from './little-diamond';

describe('LittleDiamond', () => {
  let component: LittleDiamond;
  let fixture: ComponentFixture<LittleDiamond>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LittleDiamond],
    }).compileComponents();

    fixture = TestBed.createComponent(LittleDiamond);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
