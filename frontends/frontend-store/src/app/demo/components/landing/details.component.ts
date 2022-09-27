import { Component, Input, Output, EventEmitter } from '@angular/core';
import { library, Review } from './landing.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html'
})
export class DetailsComponent {
  @Input() isShow: boolean = false;
  @Input() data: Review[] = [];
  @Input() libro: library = {
    titulo: '',
    isbn: '',
    autor: '',
    descripcion: '',
    valor: '',
    unidades: 0
  };
  @Output() onAddCart = new EventEmitter<string>();

  constructor() {

  }
  EmmitAddCart(){
    console.log("call addcart")
    this.onAddCart.emit(this.libro.isbn)
  }

}