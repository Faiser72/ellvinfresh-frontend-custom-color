/*
   Authors : pvgroups
  Website : https://pvgroups.com/
  App Name : Ellvin Fresh
  Created : 1-jan-2021
  This App Template Source code is licensed as per the
  terms found in the Website https://pvgroups.com/license
  Copyright and Good Faith Purchasers © 2020-present pvgroups.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaytmcallbackRoutingModule } from './paytmcallback-routing.module';
import { PaytmcallbackComponent } from './paytmcallback.component';


@NgModule({
  declarations: [PaytmcallbackComponent],
  imports: [
    CommonModule,
    PaytmcallbackRoutingModule
  ]
})
export class PaytmcallbackModule { }
