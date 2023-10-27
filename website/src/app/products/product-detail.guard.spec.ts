import { TestBed } from '@angular/core/testing';

import { ProductDetailGuard } from './product-detail.guard';

import { ConvertToSpacesPipe } from '../shared/convert-to-spaces.pipe';

describe('ProductDetailGuard', () => {
  let guard: ProductDetailGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertToSpacesPipe ]
    });
    guard = TestBed.inject(ProductDetailGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
