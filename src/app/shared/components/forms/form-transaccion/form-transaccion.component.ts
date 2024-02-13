import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { transaccionInicial } from 'src/app/models/transaccion.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-form-transaccion',
  templateUrl: './form-transaccion.component.html',
  styleUrls: ['./form-transaccion.component.scss'],
})
export class FormTransaccionComponent  implements OnInit {


  public categoriasIngreso: string[] = [];
  public categoriasAcreedores: string[] = [];
  public cuentas: string[] = [];

  utilsSvc =  inject(UtilsService);
  firebaseSvc = inject(FirebaseService);


  form = new FormGroup({
    trans_tipo_id: new FormControl(''),
    trans_cant:  new FormControl(null,  [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    trans_desc: new FormControl('', [Validators.required, Validators.minLength(4)]),
    trans_cat_ing:  new FormControl('', [Validators.required]),
    trans_cta_id: new FormControl('', [Validators.required]),
    trans_metodo_cobro: new FormControl('', [Validators.required]),
    trans_cat_per: new FormControl('', [Validators.required]),
    
  });




  trans_tipos : Array<{ trans_tipo_id: string, trans_tipo_nom: string }> = [
    { trans_tipo_id: "ingreso", trans_tipo_nom: 'Ingreso' },
    { trans_tipo_id: "transaccion", trans_tipo_nom: 'Transaccion' },
  ];


  metodos_tipos : Array<{ metodo_tipo_id: string, metodo_tipo_nom: string }> = [
    { metodo_tipo_id: "contado", metodo_tipo_nom: 'Contado' },
    { metodo_tipo_id: "credito", metodo_tipo_nom: 'Crédito' },
  ];



  constructor() { }


  ngOnInit() {
    this.obtenerCategorias();
    this.obtenerCuentas();
  }


  cerrarModal(){
    this.utilsSvc.cancelarModal();
 }


  async enviarIngreso(){

    this.form.controls.trans_cant.setValue(Number(this.form.controls.trans_cant.value));
    
      const valoresTransaccion: transaccionInicial = {
        trans_id: '',
        trans_tpo: this.utilsSvc.obtenerFechaCompleta(),
        trans_desc: this.form.controls.trans_desc.value,
        trans_cant: this.form.value.trans_cant,
        trans_tipo: 'ingreso',
        trans_cat_ing: this.form.controls.trans_cat_ing.value,
        trans_cta_id:  this.form.controls.trans_cta_id.value,
        trans_metodo_cobro:  this.form.controls.trans_metodo_cobro.value,
        trans_cat_per:  this.form.controls.trans_cat_per.value,
      };

    await this.firebaseSvc.generaTransaccion(1, valoresTransaccion).then(async res => {
      this.cerrarModal();
      this.firebaseSvc.notificarEventoExitoso();    
      this.utilsSvc.mostrarAlerta({
        message: 'Se ha agregado la transaccion',
        duration: 2000,
        color: 'primary',
        icon: 'alert-circle-outline',
        position: 'bottom'
      });
     });

  }

  enviarTransaccion(){

  }


  obtenerCategorias(){
    this.firebaseSvc.obtenerCategorias('ingresos').then((categoriasIngreso: string[]) => {
     this.categoriasIngreso = categoriasIngreso;
     console.log(this.categoriasIngreso)
   });

   this.firebaseSvc.obtenerCategorias('acredores').then((categoriasAcreedores: string[]) => {
    this.categoriasAcreedores = categoriasAcreedores;
    console.log(this.categoriasAcreedores)
  });
}

obtenerCuentas(){
  this.firebaseSvc.obtenerCuentasBancarias().then((cuentas: string[]) => {
    this.cuentas = cuentas;
    console.log(this.cuentas)
  });
}

}
