import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentasxpPageRoutingModule } from './cuentasxp-routing.module';

import { CuentasxpPage } from './cuentasxp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuentasxpPageRoutingModule
  ],
  declarations: [CuentasxpPage]
})
export class CuentasxpPageModule {}
