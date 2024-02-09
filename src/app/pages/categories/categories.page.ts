import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormCategoriasComponent } from 'src/app/shared/components/forms/form-categorias/form-categorias.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {

  public acreedores: string[] = [];
  public gastos: string[] = [];
  public ingresos: string[] = [];

  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  usuario = this.utilsSvc.obtenerLocalStorage('usr_mst').usr_id

  constructor() {
    this.firebaseSvc.eventoExitoso$.subscribe(() => {
      this.obtenerCategorias();
    });
   }

  ngOnInit() {

  }


  ionViewWillEnter() {
    this.obtenerCategorias();
  }


  obtenerCategorias(){
   this.firebaseSvc.obtenerCategorias('ingresos').then((categorias: string[]) => {
    this.ingresos = categorias;
    console.log(this.ingresos)
  });

  this.firebaseSvc.obtenerCategorias('gastos').then((categorias: string[]) => {
    this.gastos = categorias;
    console.log(this.gastos)
  });

  this.firebaseSvc.obtenerCategorias('acredores').then((categorias: string[]) => {
    this.acreedores = categorias;
    console.log(this.acreedores)
  });

  }
  
  eliminarCategoria(categoria: string){

    console.log('La categoria a eliminar es:' +categoria);

    this.firebaseSvc.eliminarCategoria(categoria).then( res => {
      this.utilsSvc.mostrarAlerta({
        message: 'Se eliminó la categoria exitosamente',
        duration: 2000,
        color: 'primary',
        icon: 'alert-circle-outline',
        position: 'bottom'
      })
      this.obtenerCategorias();
    })

  }

  formCuentasAcualiza(categoria: string){
    console.log('La categoria a editar es:' +categoria);

    this.utilsSvc.mostrarModal({
      component: FormCategoriasComponent,
      componentProps: {
        categoria
      }
    })

  }

  formCategorias(){
      this.utilsSvc.mostrarModal({
        component: FormCategoriasComponent
      })
  }

}
