/*
   Authors : pvgroups
  Website : https://pvgroups.com/
  App Name : Ellvin Fresh
  Created : 1-jan-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://pvgroups.com/license
  Copyright and Good Faith Purchasers © 2020-present pvgroups.
*/
import { TestBed, async, inject } from '@angular/core/testing';

import { cartGuard } from './auth.guard';

describe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [cartGuard]
    });
  });

  it('should ...', inject([cartGuard], (guard: cartGuard) => {
    expect(guard).toBeTruthy();
  }));
});
