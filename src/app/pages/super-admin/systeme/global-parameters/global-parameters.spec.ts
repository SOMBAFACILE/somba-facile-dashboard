import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalParameters } from './global-parameters';

describe('GlobalParameters', () => {
  let component: GlobalParameters;
  let fixture: ComponentFixture<GlobalParameters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GlobalParameters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlobalParameters);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
