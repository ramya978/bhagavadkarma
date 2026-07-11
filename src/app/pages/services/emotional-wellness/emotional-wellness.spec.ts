import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionalWellness } from './emotional-wellness';

describe('EmotionalWellness', () => {
  let component: EmotionalWellness;
  let fixture: ComponentFixture<EmotionalWellness>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmotionalWellness],
    }).compileComponents();

    fixture = TestBed.createComponent(EmotionalWellness);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
