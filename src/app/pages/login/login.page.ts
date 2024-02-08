import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = new FormGroup({
    usr_correo: new FormControl('', [Validators.required, Validators.email]),
    usr_con: new FormControl('', [Validators.required]),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {

  }


  async accesar() {
    if (this.form.valid) {
      const cargando = await this.utilsSvc.cargando();
      await cargando.present();

      this.firebaseSvc.iniciarSesion(this.form.value as Usuario).then(res => {
        this.obtenerInfoUsuario(res.user.uid);
      }).catch(error => {
    

        this.utilsSvc.mostrarAlerta({

          message: error.message,
          duration: 2000,
          color: 'primary',
          icon: 'alert-circle-outline',
          position: 'bottom'

        });

      }).finally(() => {
        cargando.dismiss();
      })
    }
  }

  async obtenerInfoUsuario(uid: string) {
    if (this.form.valid) {
      const cargando = await this.utilsSvc.cargando();
      await cargando.present();


      let ruta = `usr_mst/${uid}`;

      this.firebaseSvc.obtenerDocumento(ruta).then((usuario: Usuario) => {

       this.utilsSvc.guardarLocalStorage('usr_mst', usuario);
       this.utilsSvc.enrutar('/home');
       this.form.reset();


       this.utilsSvc.mostrarAlerta({
        message: `Bienvenido, ${usuario.usr_nom}`,
        duration: 2000,
        color: 'primary',
        icon: 'person-circle-outline',
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
        cargando.dismiss();
      });
    }
  }

}
