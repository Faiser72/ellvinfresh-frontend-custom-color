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

import { TopStoreRoutingModule } from './top-store-routing.module';
import { TopStoreComponent } from './top-store.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [TopStoreComponent],
  imports: [
    CommonModule,
    TopStoreRoutingModule,
    SharedModule
  ]
})
export class TopStoreModule { }
