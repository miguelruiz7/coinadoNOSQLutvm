import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormCuentasComponent } from './components/forms/form-cuentas/form-cuentas.component';
import { CustomInputSelectComponent } from './components/custom-input-select/custom-input-select.component';
import { FormCategoriasComponent } from './components/forms/form-categorias/form-categorias.component';
import { FormTransaccionComponent } from './components/forms/form-transaccion/form-transaccion.component';
import { ModalTransaccionesComponent } from './components/modal/modal-transacciones/modal-transacciones.component';

@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    NavbarComponent,
    FormCuentasComponent,
    FormCategoriasComponent,
    FormTransaccionComponent,
    CustomInputSelectComponent,
    ModalTransaccionesComponent
  ],
  exports:[
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule,
    NavbarComponent,
    FormCuentasComponent,
    FormCategoriasComponent,
    FormTransaccionComponent,
    CustomInputSelectComponent,
    ModalTransaccionesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { 
  
}
