import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CuentasxpPage } from './cuentasxp.page';

const routes: Routes = [
  {
    path: '',
    component: CuentasxpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CuentasxpPageRoutingModule {}
