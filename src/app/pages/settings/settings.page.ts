import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  firebaseSvc =  inject(FirebaseService);

  constructor() { }

  ngOnInit() {}

  cerrarSesion(){
    this.firebaseSvc.cerrarSesion();
  }


}
