import { FormsModule } from '@angular/forms';
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

import { ChangeNumberRoutingModule } from './change-number-routing.module';
import { ChangeNumberComponent } from './change-number.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { MDBBootstrapModule } from 'angular-bootstrap-md';


@NgModule({
  declarations: [ChangeNumberComponent],
  imports: [
    CommonModule,
    ChangeNumberRoutingModule,
    SharedModule,
    NgOtpInputModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
  ]
})
export class ChangeNumberModule { }
