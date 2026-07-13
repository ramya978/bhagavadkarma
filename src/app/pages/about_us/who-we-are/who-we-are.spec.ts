import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoWeAre } from './who-we-are';

describe('WhoWeAre', () => {
  let component: WhoWeAre;
  let fixture: ComponentFixture<WhoWeAre>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoWeAre],
    }).compileComponents();

    fixture = TestBed.createComponent(WhoWeAre);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
