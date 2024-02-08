import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: String;
  @Input() label!: String;
  @Input() autocomplete!: String;
  @Input() icon!: String;
  
  esContrasena!: boolean;
  oculto: boolean = true;



  constructor() { }

  ngOnInit() {
    if(this.type == 'password'){
      this.esContrasena = true;
    }
  }

  muestraCampoContrasena(){
    this.oculto = !this.oculto

    if(this.oculto) this.type = 'password'
    else this.type = 'text';
  }

}
