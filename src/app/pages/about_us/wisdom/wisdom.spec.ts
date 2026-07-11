import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wisdom } from './wisdom';

describe('Wisdom', () => {
  let component: Wisdom;
  let fixture: ComponentFixture<Wisdom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wisdom],
    }).compileComponents();

    fixture = TestBed.createComponent(Wisdom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
