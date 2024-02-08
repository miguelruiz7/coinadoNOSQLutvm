import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';



const passwordMatch = (control: FormGroup): Validators => {
  const contrasena = control.get('usr_con').value;
  const contrasenacon = control.get('usr_con_con').value;

  return contrasena === contrasenacon ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  form = new FormGroup({
    usr_id: new FormControl(''),
    usr_nom: new FormControl('', [Validators.required, Validators.minLength(4)]),
    usr_correo: new FormControl('', [Validators.required, Validators.email]),
    usr_con: new FormControl('', [Validators.required]),
    usr_con_con: new FormControl('', [Validators.required])
  }, { validators: passwordMatch});

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {

  }

  async accesar() {
    if (this.form.valid) {
      const cargando = await this.utilsSvc.cargando();
      await cargando.present();

      this.firebaseSvc.crearUsuario(this.form.value as Usuario).then(async res => {
        await this.firebaseSvc.actualizarUsuario(this.form.value.usr_nom);

        let uid = res.user.uid;
        this.form.controls.usr_id.setValue(uid);

        this.establecerInfoUsuario(uid);

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


  async establecerInfoUsuario(uid: string) {
    if (this.form.valid) {
      const cargando = await this.utilsSvc.cargando();
      await cargando.present();
      let ruta = `usr_mst/${uid}`;
      delete this.form.value.usr_con;
      delete this.form.value.usr_con_con;

      this.firebaseSvc.insertarDocumento(ruta, this.form.value).then(async res => {
       this.utilsSvc.guardarLocalStorage('usr_mst', this.form.value);
       this.utilsSvc.enrutar('/home');
       this.form.reset();
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
