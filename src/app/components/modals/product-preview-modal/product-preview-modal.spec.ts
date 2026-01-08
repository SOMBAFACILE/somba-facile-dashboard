import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPreviewModal } from './product-preview-modal';

describe('ProductPreviewModal', () => {
  let component: ProductPreviewModal;
  let fixture: ComponentFixture<ProductPreviewModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPreviewModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductPreviewModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
