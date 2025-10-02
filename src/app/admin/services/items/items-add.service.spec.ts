import { TestBed } from '@angular/core/testing';

import { ItemsAddService } from './items-add.service';

describe('ItemsAddService', () => {
  let service: ItemsAddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemsAddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
