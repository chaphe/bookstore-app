import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from './../environments/environment';

interface Review {
  usuario: string,
  isbn: string,
  estrellas: number,
  comentario: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  //host = "http://localhost:3000"//direccion del servidor
  host = environment.reviewsUrl;//direccion del servidor
  title = 'frontend-review';
  lista: Review[] = []

  /*
  otra manera de obtener la referencia hacia un elemento en el DOM
  @ViewChild('isbn') 
  isbn: ElementRef | null = null;*/
  public isbnbyid = "";//con viewChild

  public usuario = "";
  public isbn = "";
  public stars = 0;
  public comentario = "";
  public id: string | null = null;


  constructor(private http: HttpClient) {
    http.get(this.host + "/reviews").subscribe((res) => {
      console.log(res);
      this.lista = res as Review[];
    })
  }

  sendreview() {
    this.http.post(this.host+`/addreviews?usuario=${this.usuario}&isbn=${this.isbn}&estrellas=${this.stars}&comentario=${this.comentario}`, null).subscribe((res) => {
      console.log(res);
      var data = { usuario: this.usuario, isbn: this.isbn, comentario: this.comentario, estrellas: this.stars }

      var index = this.lista.findIndex(e => e.isbn == this.isbn && e.usuario == this.usuario);
      if (index == -1) {
        this.lista.push(data);
        alert("nueva reseña agregada");
      } else {
        this.lista[index] = data;
        alert("reseña actualizada");
      }

    })
  }
  deleteitem(item: Review) {
    console.log(item)
    this.http.delete(this.host + `/deletereviews?usuario=${item.usuario}&isbn=${item.isbn}`).subscribe((res) => {
      this.lista = this.lista.filter(e => e != item);
    })
  }
  editar(item: Review) {
    this.usuario = item.usuario;
    this.isbn = item.isbn;
    this.comentario = item.comentario;
    this.stars = item.estrellas;
  }


}
