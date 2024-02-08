import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent  implements OnInit {

  firebaseSvc =  inject(FirebaseService);

  constructor() { }

  ngOnInit() {}

  cerrarSesion(){
    this.firebaseSvc.cerrarSesion();
  }


}
