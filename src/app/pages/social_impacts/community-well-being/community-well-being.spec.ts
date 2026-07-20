import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityWellBeingComponent } from './community-well-being';

describe('CommunityWellBeingComponent', () => {
  let component: CommunityWellBeingComponent;
  let fixture: ComponentFixture<CommunityWellBeingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityWellBeingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityWellBeingComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});