import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CuentasxcPageRoutingModule } from './cuentasxc-routing.module';

import { CuentasxcPage } from './cuentasxc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CuentasxcPageRoutingModule
  ],
  declarations: [CuentasxcPage]
})
export class CuentasxcPageModule {}
