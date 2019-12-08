import { TestBed } from '@angular/core/testing';

import { ApiOrdersService } from './api-orders.service';

describe('ApiOrdersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiOrdersService = TestBed.get(ApiOrdersService);
    expect(service).toBeTruthy();
  });
});
