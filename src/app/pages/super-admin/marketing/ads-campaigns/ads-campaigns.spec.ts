import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsCampaigns } from './ads-campaigns';

describe('AdsCampaigns', () => {
  let component: AdsCampaigns;
  let fixture: ComponentFixture<AdsCampaigns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsCampaigns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsCampaigns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
