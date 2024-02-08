import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import {Chart} from 'chart.js';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('myChart', { static: true }) myChart: ElementRef | any;
  @ViewChild('myChart2', { static: true }) myChart2: ElementRef | any;
  
  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  saldos: number[];

  ionViewWillEnter(){
    this.leerInforme();
      }
      

  leerInforme(){
    this.firebaseSvc.generarReportes().then((saldos: number[]) => {
      this.saldos = saldos;
      this.generarGrafica(this.saldos[0],this.saldos[1],this.saldos[2]);
    }).finally(() => {
     
    })
  }



   calcularAhorro(opcion:string, saldoTotal, saldoInicial){
    let operacion = (saldoTotal / saldoInicial - 1) * 100;
    let operacionGasto = saldoTotal - saldoInicial ;
  
  switch(opcion){
    
    case 'ahorroNum':
  
    if(Number.isNaN(operacion)){
      return 0;
    }else {
      return operacion.toFixed(0);
    }
  
  
   case 'ahorroLetra':
  
   if(operacion < 0){
    return 'Disminución del ahorro total';
   }else{
    return 'Aumento del ahorro total';
   }
  
   case 'gastoNum':
    return operacionGasto.toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    });
  
    case 'gastoLetra':
      if(operacionGasto < 0){
       return 'Gastados de más este periodo';
      }else{
       return 'Ahorrados este periodo';
      }
  
  
    default:
      return 'Operacion inválida'
  }
  }

  
generarGrafica(inicial: number, final: number, total: number) {
  // Destruye cualquier gráfico existente
  if (this.myChart) {
    this.myChart.destroy();
  }
  if (this.myChart2) {
    this.myChart2.destroy();
  }

  // Crea los canvas
  const canvas = document.getElementById('myChart') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const canvas2 = document.getElementById('myChart2') as HTMLCanvasElement;
  const ctx2 = canvas2.getContext('2d');

  // Crea el primer gráfico
  if (ctx) {
    const saldoInicial = inicial;
    const saldoFinal = final;
    const saldoTotal = total;

    // Crea el conjunto de datos
    const dataset = {
      label: 'Inicial',
      data: [saldoInicial],
      borderWidth: 1,
      barThickness: 50 ,
      borderColor: '#2dd36f',
      backgroundColor: '#2dd36f',
    };

    // Crea el gráfico
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Inicial'],
        datasets: [dataset]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: Math.max(saldoInicial, saldoFinal),
            display: false
          },
          x: {
            display: false
          }
        },
        plugins: {
          legend: {display: false}
        }
      }
    });
  }

  // Crea el segundo gráfico
  if (ctx2) {
    const saldoInicial = inicial;
    const saldoFinal = final;
    const saldoTotal = total;

    // Crea el conjunto de datos
    const dataset = {
      label: 'Final',
      data: [saldoTotal],
      borderWidth: 1,
      barThickness: 50,
      borderColor: '#2dd36f',
      backgroundColor: '#2dd36f',
    };

    // Crea el gráfico
    this.myChart2 = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: ['Final'],
        datasets: [dataset]
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: Math.max(saldoInicial, saldoFinal),
            display: false
          },
          x: {
            display: false
          }
        },
        plugins: {
          legend: {display: false}
        }
     
      }
    });
  }
}



  obtenerFecha(){
   return this.utilSvc.obtenerFecha();
  }


  obtenerNombre() {
    let nombreCompleto = this.utilSvc.obtenerLocalStorage('usr_mst').usr_nom;
    let palabras = nombreCompleto.split(' ');
    return palabras[0];
  }

  
  

}
