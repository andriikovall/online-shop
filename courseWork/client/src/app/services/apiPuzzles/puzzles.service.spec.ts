import { TestBed } from '@angular/core/testing';

import { PuzzlesService } from './puzzles.service';

describe('PuzzlesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PuzzlesService = TestBed.get(PuzzlesService);
    expect(service).toBeTruthy();
  });
});
