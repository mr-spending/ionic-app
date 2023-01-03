import { TestBed } from '@angular/core/testing';

import { MonoBankApiService } from './mono-bank-api.service';

describe('MonoBankApiService', () => {
  let service: MonoBankApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonoBankApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
