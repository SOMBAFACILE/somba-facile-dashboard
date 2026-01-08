import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recharges } from './recharges';

describe('Recharges', () => {
  let component: Recharges;
  let fixture: ComponentFixture<Recharges>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recharges]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recharges);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
