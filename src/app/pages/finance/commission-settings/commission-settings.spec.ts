import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionSettings } from './commission-settings';

describe('CommissionSettings', () => {
  let component: CommissionSettings;
  let fixture: ComponentFixture<CommissionSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommissionSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
