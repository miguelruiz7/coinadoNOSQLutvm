import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormTransaccionComponent } from '../forms/form-transaccion/form-transaccion.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {

  firebaseSvc =  inject(FirebaseService);
  
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {}

  public accionesAgregar = [
    {
      text: 'Movimiento',
      data: {
        action: 'add_transaccion',
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    }
  ];



  logResult(ev) {

    switch(ev.detail.data.action){
     case 'add_transaccion':
      this.utilsSvc.mostrarModal({
        component: FormTransaccionComponent,
      });

       break;
    }
   }


}
