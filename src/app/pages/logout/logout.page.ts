import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  firebaseSvc =  inject(FirebaseService);

  constructor() { }

  ngOnInit() {
    this.firebaseSvc.cerrarSesion();
  }

}
