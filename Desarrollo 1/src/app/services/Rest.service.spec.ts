import { TestBed } from '@angular/core/testing';

import { RestService } from './rest.service';

describe('ServicesService', () => {
  beforeEach( () => TestBed.configureTestingModule( {} ) );

  it('should be created', () => {
    const service: RestService = TestBed.get( RestService );
    expect( service ).toBeTruthy();
  });
});
