import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgricultureDevelopment } from './agriculture-development';

describe('AgricultureDevelopment', () => {
  let component: AgricultureDevelopment;
  let fixture: ComponentFixture<AgricultureDevelopment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgricultureDevelopment],
    }).compileComponents();

    fixture = TestBed.createComponent(AgricultureDevelopment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
