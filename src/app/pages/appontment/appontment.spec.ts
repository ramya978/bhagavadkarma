import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Appontment } from './appontment';

describe('Appontment', () => {
  let component: Appontment;
  let fixture: ComponentFixture<Appontment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Appontment],
    }).compileComponents();

    fixture = TestBed.createComponent(Appontment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
