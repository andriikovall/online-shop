import { TestBed } from '@angular/core/testing';

import { HttpMouseLoadingService } from './http-mouse-loading.service';

describe('HttpMouseLoadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpMouseLoadingService = TestBed.get(HttpMouseLoadingService);
    expect(service).toBeTruthy();
  });
});
