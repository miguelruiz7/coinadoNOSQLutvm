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
  saldoInicial: number;
  saldoTotal: number;
  saldoFinal: number;

  ionViewWillEnter(){
    this.leerInforme();
      }
      

  leerInforme(){
  this.firebaseSvc.generarReportes().then((informe: { totalIniciales: number, totalGeneral: number, totalSaldo : number }[]) => {
    this.saldoInicial = informe[0].totalIniciales;
    this.saldoFinal = informe[0].totalGeneral;
    this.saldoTotal = informe[0].totalSaldo;

    console.log('Saldos: '+informe[0].totalSaldo);
  
    this.generarGrafica(this.saldoInicial, this.saldoFinal, this.saldoTotal);
  }).catch(err => {
    console.error(err);
    console.log('Error');
  });

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
