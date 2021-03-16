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

import { SubcatsRoutingModule } from './subcats-routing.module';
import { SubcatsComponent } from './subcats.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [SubcatsComponent],
  imports: [
    CommonModule,
    SubcatsRoutingModule,
    NgxSkeletonLoaderModule,
    MDBBootstrapModule.forRoot(),
    SharedModule,
    NgbModule
  ]
})
export class SubcatsModule { }
