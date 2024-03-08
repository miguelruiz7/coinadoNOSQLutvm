import { Component, Input, OnInit, inject } from '@angular/core';
import { Cuenta } from 'src/app/models/cuenta.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import moment from 'moment';


@Component({
  selector: 'app-modal-transacciones',
  templateUrl: './modal-transacciones.component.html',
  styleUrls: ['./modal-transacciones.component.scss'],
})
export class ModalTransaccionesComponent  implements OnInit {

  @Input() cuenta: Cuenta; 

  public transaccionesCuenta: string[] = [];
  public informacionCuenta: string[] = [];
  


  utilsSvc =  inject(UtilsService);
  
  firebaseSvc =  inject(FirebaseService);


  constructor() { }

  ngOnInit() {

    this.obtenerTransacciones(this.cuenta);
    this.obtenerInfoCuenta(this.cuenta);
   
  }

  cerrarModal(){
    this.utilsSvc.cancelarModal();
  }

  


  async obtenerInfoCuenta(cuenta){

    const cargando = await this.utilsSvc.cargando();
    await cargando.present();

    this.firebaseSvc.obtenerInfoCuenta(cuenta).then((cuenta: string[]) => {
      this.informacionCuenta = cuenta;

      console.log(cuenta);

      if (this.informacionCuenta.length == 0) {
        this.utilsSvc.mostrarAlerta({
          message: 'Ocurre un error',
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

  async obtenerTransacciones(cuenta, mes=''){
    if(mes == ''){
    const fecha = this.utilsSvc.obtenerFechaParcial(0);
    const cargando = await this.utilsSvc.cargando();
    await cargando.present();
    this.firebaseSvc.obtenerTransacciones(cuenta, fecha).then((transacciones: string[]) => {
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
  }else{

    var fechaMesAnterior = moment().subtract(1, 'months');
    var fechaAnterior =  fechaMesAnterior.format('YYYY-MM'); 
    

    const cargando = await this.utilsSvc.cargando();
    await cargando.present();
    this.firebaseSvc.obtenerTransacciones(cuenta, fechaAnterior).then((transacciones: string[]) => {
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



obtenerTransaccionesAnteriores(condicion = null){
  if(condicion == null){
  this.obtenerTransacciones(this.cuenta, 'verdadero');
  }

  if(condicion == 1){
  this.obtenerTransacciones(this.cuenta);
  }
}

}
