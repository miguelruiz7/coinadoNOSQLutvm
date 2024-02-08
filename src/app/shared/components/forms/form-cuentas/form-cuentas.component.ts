import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Cuenta } from 'src/app/models/cuenta.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { transaccionInicial } from 'src/app/models/transaccion.model';


@Component({
  selector: 'app-form-cuentas',
  templateUrl: './form-cuentas.component.html',
  styleUrls: ['./form-cuentas.component.scss'],
})
export class FormCuentasComponent  implements OnInit {

  @Input() cuenta: Cuenta; 

  utilsSvc =  inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  ngOnInit() {
    if(this.cuenta){
      this.obtenerInfoCuenta(this.cuenta);
    }
  }

  
  usuario = this.utilsSvc.obtenerLocalStorage('usr_mst').usr_id


  form = new FormGroup({
    cta_id: new FormControl(''),
    cta_nom: new FormControl('', [Validators.required, Validators.minLength(4)]),
    cta_cta_tipo: new FormControl('', [Validators.required]),
    cta_saldo: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    cta_usr_id: new FormControl(this.usuario)
  });


  transaccionInicial = new FormGroup({
    trans_id: new FormControl(''),
    trans_tpo: new FormControl(''),
    trans_desc: new FormControl(''),
    trans_cant: new FormControl(''),
    trans_tipo: new FormControl(''),
    trans_cta_id: new FormControl('')
  })



  constructor() {
   
   }


  enviarCuenta(){
    if(this.form.valid){
      if(this.cuenta){
        this.actualizarCuenta();
      }else{
        this.insertarCuenta();
      }
    }
  }


  cerrarModal(){
     this.utilsSvc.cancelarModal();
  }

  async insertarCuenta(){
   
      delete this.form.value.cta_id;

     


      this.firebaseSvc.crearCuenta(this.form.value).then(async res => {

        const valoresTransaccion: transaccionInicial = {
          trans_id: '',
          trans_tpo: this.utilsSvc.obtenerFechaCompleta(),
          trans_desc: 'Saldo inicial',
          trans_cant: this.form.value.cta_saldo,
          trans_tipo: 'abono',
          trans_cta_id: res.id
        };

        console.log(res);

       await this.firebaseSvc.generaTransaccion(1, valoresTransaccion).then(async res => {
        this.cerrarModal();
        this.firebaseSvc.notificarEventoExitoso();    
        this.utilsSvc.mostrarAlerta({
          message: 'Se ha agregado la cuenta',
          duration: 2000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'bottom'
        });
       });


      }).catch(error => {
        this.utilsSvc.mostrarAlerta({
          message: error.message,
          duration: 2000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'bottom'
        });
      }).finally(() => {
     
      });
    
  }

  async actualizarCuenta(){
      this.firebaseSvc.modificarCuenta(this.form.value as Cuenta).then(async res => {
        this.cerrarModal();
        this.firebaseSvc.notificarEventoExitoso();    
   
        this.utilsSvc.mostrarAlerta({
          message: 'Se ha modificado la cuenta',
          duration: 2000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'bottom'
        });

      }).catch(error => {
        this.utilsSvc.mostrarAlerta({
          message: error.message,
          duration: 2000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'bottom'
        });
      }).finally(() => {
     
      });
  
  }


  async obtenerInfoCuenta(cuenta: Cuenta){
    console.log('Se obtendra la info: ' + cuenta)
    this.firebaseSvc.obtenerInfoCuenta(cuenta).then((data: Cuenta) => {
       this.form.controls.cta_nom.setValue(data.cta_nom);
       this.form.controls.cta_saldo.setValue(data.cta_saldo);
       this.form.controls.cta_cta_tipo.setValue(data.cta_cta_tipo);
       this.form.controls.cta_id.setValue(cuenta.toString());
    });
  }



}
