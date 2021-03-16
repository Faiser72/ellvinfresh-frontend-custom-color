/*
   Authors : pvgroups
  Website : https://pvgroups.com/
  App Name : Ellvin Fresh
  Created : 1-jan-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://pvgroups.com/license
  Copyright and Good Faith Purchasers © 2020-present pvgroups.
*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';


@Injectable({
  providedIn: 'root'
})
export class cartGuard implements CanActivate {
  constructor(
    private navCtrl: Router,
    private cart: CartService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.cart.cart && this.cart.cart.length) {
      return true;
    }
    this.navCtrl.navigate(['/home']);
    return false;
  }
}
