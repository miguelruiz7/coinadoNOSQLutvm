import { Component, Input, OnInit, inject } from '@angular/core';
import { Cuenta } from 'src/app/models/cuenta.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-modal-transacciones',
  templateUrl: './modal-transacciones.component.html',
  styleUrls: ['./modal-transacciones.component.scss'],
})
export class ModalTransaccionesComponent  implements OnInit {

  @Input() cuenta: Cuenta; 

  public transaccionesCuenta: string[] = [];


  utilsSvc =  inject(UtilsService);
  
  firebaseSvc =  inject(FirebaseService);


  constructor() { }

  ngOnInit() {
    this.obtenerTransacciones(this.cuenta);
  }

  cerrarModal(){
    this.utilsSvc.cancelarModal();
  }


  async obtenerTransacciones(cuenta){
    const cargando = await this.utilsSvc.cargando();
    await cargando.present();

    this.firebaseSvc.obtenerTransacciones(cuenta).then((transacciones: string[]) => {
      this.transaccionesCuenta = transacciones;

      console.log(transacciones);

      if (this.transaccionesCuenta.length == 0) {
        this.utilsSvc.mostrarAlerta({
          message: 'No hay transacciones en esta cuenta',
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

}
