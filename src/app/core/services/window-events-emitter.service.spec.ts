import { TestBed } from '@angular/core/testing';

import { WindowEventsEmitterService } from './window-events-emitter.service';

describe('WindowEventsEmitterService', () => {
  let service: WindowEventsEmitterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WindowEventsEmitterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
