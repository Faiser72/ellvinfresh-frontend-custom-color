/*
   Authors : pvgroups
  Website : https://pvgroups.com/
  App Name : Ellvin Fresh
  Created : 1-jan-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://pvgroups.com/license
  Copyright and Good Faith Purchasers © 2020-present pvgroups.
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
@Component({
  selector: 'app-footers',
  templateUrl: './footers.component.html',
  styleUrls: ['./footers.component.scss']
})
export class FootersComponent implements OnInit {
  year: any;
  constructor(
    private router: Router,
    public util: UtilService) {
    this.year = moment().format('YYYY');
  }

  ngOnInit(): void {
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  goToAccount() {
    this.router.navigate(['/account']);
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  goToPrivacyPolicy() {
    this.router.navigate(['/privacy-policy']);
  }

  goToShippingPolicy() {
    this.router.navigate(['/shipping-policy']);
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }

  goToRefund() {
    this.router.navigate(['/refund-policy']);
  }

  goToHelp() {
    this.router.navigate(['/help']);
  }

  about() {
    this.router.navigate(['/about']);
  }

  goToBlog(){
  }

  goToCareers() {
  }

  goToFaq() {
  }

  goToTermsNConditions() {
  }

}
