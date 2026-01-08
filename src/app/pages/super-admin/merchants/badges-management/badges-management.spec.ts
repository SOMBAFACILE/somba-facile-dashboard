import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgesManagement } from './badges-management';

describe('BadgesManagement', () => {
  let component: BadgesManagement;
  let fixture: ComponentFixture<BadgesManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgesManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BadgesManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
