import { TestBed } from '@angular/core/testing';

import { ReembolsoService } from './reembolso.service';

describe('ReembolsoService', () => {
  let service: ReembolsoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReembolsoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
