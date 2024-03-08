import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  controlCarga = inject(LoadingController);
  controlToast = inject(ToastController);
  controlRuta = inject(Router); 
  controlModal = inject(ModalController);

  cargando() {
    return this.controlCarga.create({
      spinner: 'circles'
    })
  }

  async mostrarAlerta(opts?: ToastOptions) {
    const toast = await this.controlToast.create(opts);
    toast.present();
  }


async mostrarModal(opts?: ModalOptions) {
  const modal = await this.controlModal.create(opts);
  await modal.present();
  const { data } = await modal.onWillDismiss();
  if(data) return data;
}

cancelarModal(data?: any){
    return this.controlModal.dismiss(data);
}


  enrutar(url: string){
    return this.controlRuta.navigateByUrl(url);
  }

  guardarLocalStorage(key: string, value:any){
    return localStorage.setItem(key, JSON.stringify(value));
  }

   obtenerLocalStorage(key: string) {
    const valorGuardado = localStorage.getItem(key);
  
    if (valorGuardado) {
      // Si hay un valor almacenado para la clave, devolver el valor parseado
      return JSON.parse(valorGuardado);
    } else {
      // Si no hay un valor almacenado para la clave, devolver null
      return null;
    }
  }
  

  obtenerFecha(){
    const meses: string[] = ['','ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];
    let mes: number = new Date().getMonth()+1;
    let anio:number = new Date().getFullYear();
    let mesFormateado = meses[mes];
    return mesFormateado.toLowerCase() + ' ' + anio;
  }

  obtenerFechaCompleta() {
    const fechaActual = new Date();
    
    const anio = fechaActual.getFullYear();
    const mes = this.agregarCero(fechaActual.getMonth() + 1);
    const dia = this.agregarCero(fechaActual.getDate());
    const horas = this.agregarCero(fechaActual.getHours());
    const minutos = this.agregarCero(fechaActual.getMinutes());
    const segundos = this.agregarCero(fechaActual.getSeconds());

    return `${anio}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
  }

  private agregarCero(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }


  obtenerFechaParcial(tipo:number){
    var formato = '';

    if(tipo == 0 ){
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = this.agregarCero(fechaActual.getMonth() + 1);
    formato = `${anio}-${mes}`;
    }

    if(tipo == 1 ){
      const fechaActual = new Date();
      const anio = fechaActual.getFullYear();
      const mes = this.agregarCero(fechaActual.getMonth() + 1);
      formato = `${anio}-${mes}`;
      }
  

    return formato;

  }


  formateaFechas(dato, tipo){
    moment.locale('es-mx')
      var formato = '';

      if(tipo == 1){
      formato =  moment(dato).format('DD [de] MMMM [de] YYYY [a las] h:mm a');
      }
      return formato;
  }

}
