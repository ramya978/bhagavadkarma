import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuraMechanism } from './aura-mechanism';

describe('AuraMechanism', () => {
  let component: AuraMechanism;
  let fixture: ComponentFixture<AuraMechanism>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuraMechanism],
    }).compileComponents();

    fixture = TestBed.createComponent(AuraMechanism);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
