import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerHush } from './inner-hush';

describe('InnerHush', () => {
  let component: InnerHush;
  let fixture: ComponentFixture<InnerHush>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnerHush],
    }).compileComponents();

    fixture = TestBed.createComponent(InnerHush);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
