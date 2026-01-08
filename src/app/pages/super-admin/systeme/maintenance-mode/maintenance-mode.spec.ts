import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceMode } from './maintenance-mode';

describe('MaintenanceMode', () => {
  let component: MaintenanceMode;
  let fixture: ComponentFixture<MaintenanceMode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceMode]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaintenanceMode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
