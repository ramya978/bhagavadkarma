import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpiritualWellness } from './spiritual-wellness';

describe('SpiritualWellness', () => {
  let component: SpiritualWellness;
  let fixture: ComponentFixture<SpiritualWellness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpiritualWellness],
    }).compileComponents();

    fixture = TestBed.createComponent(SpiritualWellness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
