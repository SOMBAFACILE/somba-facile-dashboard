import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistManager } from './blacklist-manager';

describe('BlacklistManager', () => {
  let component: BlacklistManager;
  let fixture: ComponentFixture<BlacklistManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlacklistManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlacklistManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
