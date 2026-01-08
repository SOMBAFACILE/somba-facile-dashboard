import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycApproval } from './kyc-approval';

describe('KycApproval', () => {
  let component: KycApproval;
  let fixture: ComponentFixture<KycApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KycApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
