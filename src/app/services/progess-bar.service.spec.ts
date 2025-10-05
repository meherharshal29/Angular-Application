import { TestBed } from '@angular/core/testing';

import { ProgessBarService } from './progess-bar.service';

describe('ProgessBarService', () => {
  let service: ProgessBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgessBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
