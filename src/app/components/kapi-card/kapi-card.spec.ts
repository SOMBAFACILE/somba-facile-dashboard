import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KapiCard } from './kapi-card';

describe('KapiCard', () => {
  let component: KapiCard;
  let fixture: ComponentFixture<KapiCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KapiCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KapiCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
