import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mystic } from './mystic';

describe('Mystic', () => {
  let component: Mystic;
  let fixture: ComponentFixture<Mystic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mystic],
    }).compileComponents();

    fixture = TestBed.createComponent(Mystic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
