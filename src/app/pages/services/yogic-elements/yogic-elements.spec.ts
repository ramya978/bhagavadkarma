import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YogicElements } from './yogic-elements';

describe('YogicElements', () => {
  let component: YogicElements;
  let fixture: ComponentFixture<YogicElements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YogicElements],
    }).compileComponents();

    fixture = TestBed.createComponent(YogicElements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
