import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FraudMonitor } from './fraud-monitor';

describe('FraudMonitor', () => {
  let component: FraudMonitor;
  let fixture: ComponentFixture<FraudMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FraudMonitor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FraudMonitor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
