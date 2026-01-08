import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVersions } from './app-versions';

describe('AppVersions', () => {
  let component: AppVersions;
  let fixture: ComponentFixture<AppVersions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppVersions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppVersions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
