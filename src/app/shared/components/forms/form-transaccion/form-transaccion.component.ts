import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-form-transaccion',
  templateUrl: './form-transaccion.component.html',
  styleUrls: ['./form-transaccion.component.scss'],
})
export class FormTransaccionComponent  implements OnInit {

  utilsSvc =  inject(UtilsService);
  firebaseSvc = inject(FirebaseService);


  form = new FormGroup({
    trans_tipo_id: new FormControl(''),
    trans_cant:  new FormControl(null,  [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    trans_desc: new FormControl('', [Validators.required, Validators.minLength(4)]),
    trans_cat_ing:  new FormControl(''),
    trans_cta_id: new FormControl(''),
    trans_metodo_cobro: new FormControl(''),
    trans_cat_per: new FormControl(''),
    
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


  ngOnInit() {}


  cerrarModal(){
    this.utilsSvc.cancelarModal();
 }


  enviar(){

  }

}
