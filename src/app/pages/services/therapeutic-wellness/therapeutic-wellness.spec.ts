import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapeuticWellness } from './therapeutic-wellness';

describe('TherapeuticWellness', () => {
  let component: TherapeuticWellness;
  let fixture: ComponentFixture<TherapeuticWellness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TherapeuticWellness],
    }).compileComponents();

    fixture = TestBed.createComponent(TherapeuticWellness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
