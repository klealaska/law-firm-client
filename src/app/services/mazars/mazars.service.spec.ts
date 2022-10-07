import { TestBed } from '@angular/core/testing';

import { MazarsService } from './mazars.service';

describe('MazarsService', () => {
  let service: MazarsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MazarsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
