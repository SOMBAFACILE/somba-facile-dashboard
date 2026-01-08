import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsSettings } from './contracts-settings';

describe('ContractsSettings', () => {
  let component: ContractsSettings;
  let fixture: ComponentFixture<ContractsSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractsSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContractsSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
