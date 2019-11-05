import { TestBed } from '@angular/core/testing';

import { TokenInterseptorService } from './token-interseptor.service';

describe('TokenInterseptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TokenInterseptorService = TestBed.get(TokenInterseptorService);
    expect(service).toBeTruthy();
  });
});
