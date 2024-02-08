import { NgFor, NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input-select',
  templateUrl: './custom-input-select.component.html',
  styleUrls: ['./custom-input-select.component.scss'],
})
export class CustomInputSelectComponent  implements OnInit {

  cta_tipos : Array<{ cta_tipo_id: number, cta_tipo_nom: string }> = [
    { cta_tipo_id: 1, cta_tipo_nom: 'Debito' },
    { cta_tipo_id: 2, cta_tipo_nom: 'Credito' },
    { cta_tipo_id: 3, cta_tipo_nom: 'Efectivo' }
  ];

  @Input() control!: FormControl;
  @Input() type!: String;
  @Input() label!: String;
  @Input() autocomplete!: String;
  @Input() icon!: String;
  @Input() condicion!: String;
  
  
  constructor() { }

  ngOnInit() {}

}
