import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasxcPage } from './cuentasxc.page';

const routes: Routes = [
  {
    path: '',
    component: CuentasxcPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentasxcPageRoutingModule {}
