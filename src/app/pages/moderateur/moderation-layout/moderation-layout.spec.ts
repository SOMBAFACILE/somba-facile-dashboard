import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModerationLayout } from './moderation-layout';

describe('ModerationLayout', () => {
  let component: ModerationLayout;
  let fixture: ComponentFixture<ModerationLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModerationLayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModerationLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
