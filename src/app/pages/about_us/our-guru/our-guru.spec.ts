import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurGuru } from './our-guru';

describe('OurGuru', () => {
  let component: OurGuru;
  let fixture: ComponentFixture<OurGuru>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurGuru],
    }).compileComponents();

    fixture = TestBed.createComponent(OurGuru);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
