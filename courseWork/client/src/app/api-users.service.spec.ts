import { TestBed } from '@angular/core/testing';

import { ApiUsersService } from './api-users.service';

describe('ApiUsersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiUsersService = TestBed.get(ApiUsersService);
    expect(service).toBeTruthy();
  });
});
