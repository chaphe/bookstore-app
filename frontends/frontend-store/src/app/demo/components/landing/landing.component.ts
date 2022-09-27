import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { SelectItem } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { environment } from './../../../../environments/environment';

export interface Review {
  usuario: string,
  isbn: string,
  estrellas: number,
  comentario: string
}
export interface library {
  titulo: string, isbn: string, autor: string, descripcion: string, valor: string;
  unidades: number;
}
interface Cart { id: string, isbn: string, cantidad: number }
interface CartRelation { [id: string]: CartDataAngular }
interface CartDataAngular { libro: library, cant: number }


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styles: [`
        #hero{
            background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%);
            height:700px;
            overflow:hidden;
        }

        .pricing-card:hover{
            border:2px solid var(--cyan-200) !important;
        }

        @media screen and (min-width: 768px) {
            #hero{
                -webkit-clip-path: ellipse(150% 87% at 93% 13%);
                clip-path: ellipse(150% 87% at 93% 13%);
                height: 530px;
            }
        }

        @media screen and (min-width: 1300px){
            #hero > img {
                position: absolute;
                transform:scale(1.2);
                top:15%;
            }

        #hero > div > p {
                max-width: 450px;
            }
        }

        @media screen and (max-width: 1300px){
            #hero {
                height: 600px;
            }

        #hero > img {
            position:static;
            transform: scale(1);
            margin-left: auto;
        }

        #hero > div {
            width: 100%;
        }

        #hero > div > p {
                width: 100%;
                max-width: 100%;
            }
        }
    `]
})
export class LandingComponent {
  // hostreviews = "http://localhost:3000"//direccion del servidor de review (Express)
  // hostlibros = "http://localhost:8081"//direccion del servidor de libros (spring)
  // hoststore = "http://localhost:8082"//direccion del servidor de la tienda (spring)

  hostreviews = environment.reviewsUrl;//direccion del servidor de review (Express)
  hostlibros = environment.catalogUrl;//direccion del servidor de libros (spring)
  hoststore = environment.storeUrl;//direccion del servidor de la tienda (spring)


  libros: library[] = [];
  reviews: Review[] = [];
  usuario = "student";
  carrito: CartRelation = {};
  sendDataCarrito: boolean = false;

  detailsData: Review[] = [];
  currentLibro: any = {};
  get ShowDetails() { return this.state == "detalles" }

  state: "inicio" | "carrito" | "detalles" = "inicio";

  SetState(value: "inicio" | "carrito" | "detalles") { this.state = value; }

  GetTotal() {
    var keys = Object.keys(this.carrito);
    let total = 0;
    for (let name of keys) {
      total += this.carrito[name].cant;
    }
    return total;
  }
  KeysObjet = Object.keys;
  round = Math.round;

  GetMeanStars(isbn: string) {
    var mean = 0;
    var lista = this.reviews.filter(value => value.isbn == isbn)
    lista.forEach(element => {
      mean += element.estrellas;
    })
    if (lista.length != 0)
      mean = mean / lista.length;
    return Number(mean.toFixed(2));
  }
  CountReviews(isbn: string) {
    return this.reviews.filter(value => value.isbn == isbn).length;
  }

  constructor(private http: HttpClient, public layoutService: LayoutService, public router: Router, private productService: ProductService) {
    console.log("===================> " + this.hostreviews);
    console.log("===================> " + this.hostlibros);
    this.init(http)
  }

  init(http: HttpClient) {
    

    http.get(this.hostlibros + "/api/getlibros").subscribe((res) => {
      this.libros = res as library[];
    })

    this.GetCartShopUser();

    http.get(this.hostreviews + "/reviews").subscribe(res => {
      console.log("get reviews", res);
      this.reviews = res as Review[];
    });
  }

  GetCartShopUser() {
    this.http.get(this.hoststore + `/api/getcart?usuario=${this.usuario}`).subscribe((res) => {
      console.log("getCart", res);
      this.carrito = {};
      for (const item of res as Cart[]) {
        var libro = this.libros.find((e) => e.isbn == item.isbn)
        if (libro)
          this.carrito[item.isbn] = { libro: libro, cant: item.cantidad };
      }
    })
  }

  onclickAddCart(isbn: string) {
    console.log("call onclick")
    var cart = this.carrito[isbn]
    if (cart) {
      if (cart.cant + 1 < cart.libro.unidades)
        this.addcart(isbn, cart.cant + 1)
    } else
      this.addcart(isbn, 1);
  }

  addcart(isbn: string, cant: number) {

    //var index = this.storeCard.findIndex((item) => item == isbn)
    if (!this.carrito[isbn]/*index == -1*/) {
      //this.storeCard.push(isbn);
      var libro = this.libros.find((e) => e.isbn == isbn)
      if (libro)
        this.carrito[isbn] = { libro: libro, cant: cant };
    } else {
      this.carrito[isbn].cant = cant;
    }

    this.http.post(this.hoststore + `/api/addcart?usuario=${this.usuario}&isbn=${isbn}&cantidad=${cant}`, null)
      .subscribe((res) => {
        console.log("addcart", res)
      })
  }

  onCantChange(event: any, isbn: string) {
    this.addcart(isbn, event.value);
  }

  deletecart(isbn: string) {
    delete this.carrito[isbn];
    this.http.delete(this.hoststore + `/api/deletecart?usuario=${this.usuario}&isbn=${isbn}`).subscribe((res) => {
      console.log(res)
    })
  }

  ChangeUser() {
    console.log(this.usuario)
    this.carrito = {};
    this.init(this.http)
  }

  detalle(item: library) {
    this.currentLibro = item;
    this.detailsData = this.reviews.filter(value => value.isbn == item.isbn).sort((a, b) => b.estrellas - a.estrellas);
    this.SetState("detalles")
  }

  multiplicar(first: any, second: any) {
    return Number(first) * Number(second);
  }

  Comprar() {
    console.log(this.carrito);
    this.sendDataCarrito = true;
    this.http.post(this.hoststore + `/api/buycart?usuario=${this.usuario}`, null)
      .subscribe((res: any) => {
        console.log(res);
        this.sendDataCarrito = false;
        if (res.status == "ERROR")
          window.alert("En este momento no podemos procesar su compra, intente mas tarde");
        else
          this.GetCartShopUser();
      })
  }

}