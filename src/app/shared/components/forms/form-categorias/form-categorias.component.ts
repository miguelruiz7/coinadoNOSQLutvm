import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-form-categorias',
  templateUrl: './form-categorias.component.html',
  styleUrls: ['./form-categorias.component.scss'],
})
export class FormCategoriasComponent  implements OnInit {
  utilsSvc =  inject(UtilsService);
  firebaseSvc = inject(FirebaseService);

  usuario = this.utilsSvc.obtenerLocalStorage('usr_mst').usr_id

  form = new FormGroup({
    cat_id: new FormControl(''),
    cat_nom: new FormControl('', [Validators.required, Validators.minLength(4)]),
    cat_tipo: new FormControl('', [Validators.required]),
  });


  cat_tipos : Array<{ cat_tipo_id: string, cat_tipo_nom: string }> = [
    { cat_tipo_id: "acredores", cat_tipo_nom: 'Acredores' },
    { cat_tipo_id: "gastos", cat_tipo_nom: 'Gastos' },
    { cat_tipo_id: "ingresos", cat_tipo_nom: 'Ingresos' }
  ];



  constructor() { }

  ngOnInit() {}


  enviar(){
    this.insertarCategoria()
  }



  async insertarCategoria(){

      this.firebaseSvc.crearCategorias(this.form.value as Categoria).then(async res => {
        this.cerrarModal();
        this.firebaseSvc.notificarEventoExitoso();    
        this.utilsSvc.mostrarAlerta({
          message: 'Se ha agregado la categoria',
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


  cerrarModal(){
     this.utilsSvc.cancelarModal();
  }


}
