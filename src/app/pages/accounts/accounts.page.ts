import { Component, OnInit, inject } from '@angular/core';
import { Cuenta } from 'src/app/models/cuenta.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormCuentasComponent } from 'src/app/shared/components/forms/form-cuentas/form-cuentas.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.page.html',
  styleUrls: ['./accounts.page.scss'],
})
export class AccountsPage implements OnInit {

  public cuentasBanco: string[] = [];



  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  usuario = this.utilsSvc.obtenerLocalStorage('usr_mst').usr_id

  constructor() {
    this.firebaseSvc.eventoExitoso$.subscribe(() => {
      this.leerCuentas();
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.leerCuentas();
  }


  async leerCuentas() {
    const cargando = await this.utilsSvc.cargando();
    await cargando.present();

    this.firebaseSvc.obtenerCuentasBancarias().then((cuentas: string[]) => {
      this.cuentasBanco = cuentas;

      if (this.cuentasBanco.length == 0) {
        this.utilsSvc.mostrarAlerta({
          message: 'No hay cuentas, agregue uno',
          duration: 2000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'bottom'
        })
      }
    }).finally(() => {
      cargando.dismiss();
    })
  }




  eliminarCuenta(cuenta: string) {

    console.log('Cuenta a eliminar: '+cuenta)

 this.firebaseSvc.eliminaTransacciones(cuenta).then(res => {
  this.firebaseSvc.eliminarCuenta(cuenta).then(res => {
    this.utilsSvc.mostrarAlerta({
      message: 'Se eliminó la cuenta exitosamente',
      duration: 2000,
      color: 'primary',
      icon: 'alert-circle-outline',
      position: 'bottom'
    })
    this.firebaseSvc.notificarEventoExitoso();
  })
})
}

  formActualizarCuenta(cuenta?:Cuenta){
      this.utilsSvc.mostrarModal({
        component: FormCuentasComponent,
        componentProps: {
          cuenta
        }
      })
  }




  formCuentas() {
    this.utilsSvc.mostrarModal({
      component: FormCuentasComponent
    })
  }

}
