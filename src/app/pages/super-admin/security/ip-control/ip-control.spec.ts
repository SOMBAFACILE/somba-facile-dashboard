import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IpControl } from './ip-control';

describe('IpControl', () => {
  let component: IpControl;
  let fixture: ComponentFixture<IpControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IpControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IpControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
