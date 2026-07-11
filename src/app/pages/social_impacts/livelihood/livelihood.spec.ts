import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Livelihood } from './livelihood';

describe('Livelihood', () => {
  let component: Livelihood;
  let fixture: ComponentFixture<Livelihood>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Livelihood],
    }).compileComponents();

    fixture = TestBed.createComponent(Livelihood);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
