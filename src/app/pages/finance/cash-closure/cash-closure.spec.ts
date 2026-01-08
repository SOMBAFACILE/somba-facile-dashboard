import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashClosure } from './cash-closure';

describe('CashClosure', () => {
  let component: CashClosure;
  let fixture: ComponentFixture<CashClosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashClosure]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashClosure);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
