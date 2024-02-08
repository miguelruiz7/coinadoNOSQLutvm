import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

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

  obtenerLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
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




}