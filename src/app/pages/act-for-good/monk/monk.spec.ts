import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Monk } from './monk';

describe('Monk', () => {
  let component: Monk;
  let fixture: ComponentFixture<Monk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Monk],
    }).compileComponents();

    fixture = TestBed.createComponent(Monk);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
