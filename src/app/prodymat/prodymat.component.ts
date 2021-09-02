import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Login, Catprod, Prodymat } from './../model'
import { ProdymatService } from './../service';
import { first } from 'rxjs/operators';
import { AlertService } from './../service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';

interface Tipo {
  Tipo: string;
  desc: string;
}


@Component({
  selector: 'app-prodymat',
  templateUrl: './prodymat.component.html',
  styleUrls: ['./prodymat.component.css']
})
export class ProdymatComponent implements OnInit {
  login: Login;
  prodymatForm: FormGroup;
  detalle: boolean;
  perfil:boolean;
  prodcat: Catprod;
  loading = false;
  page: number;
  perPage: number;
  perName: string;
  total: number;
  totalPages: number;
  msg= '';
  cveprod: string;
  returnUrl: string;
  currentProdmat: ProdymatService;
  currentuMDescripcion: any[];
  prod: Tipo[] = [
    {Tipo: '6', desc: 'Productos'},
    {Tipo: '7', desc: 'Materiales'},
    {Tipo: '8', desc: 'Activo Fijo'}
  ];

  
  constructor(
    private formBuilder: FormBuilder,
    private prodymatService: ProdymatService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.page = 1;
    this.perPage = 6;
    this.perName = "";
   }

  ngOnInit(): void {
    //this.catProdMat();
    this.prodymatForm = this.formBuilder.group({
      'nombre':new FormControl('', [Validators.required]),

  });

  this.login = JSON.parse(localStorage.getItem('currentUserLog'));
  let perfillogin = this.login["idPerfil"];
  if (perfillogin=="US01"){
      this.perfil=true;      
  }else{
      this.perfil=false;
  }
  this.detalle=false;      
  }

  catProdMat(){
    this.prodymatService.catProdMat()
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.prodcat = data.contenido;
        }},
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Productos");              
          this.loading = false;
        });
  } // Cierre del método consultadatos
    consultaProdymat(cveprod:string, page: number, perPage: number, perName: string)  {    
      this.cveprod = cveprod
    this.prodymatService.Prodymatid(cveprod, page, perPage, perName)
    .pipe(first())
    .subscribe(
      data => {
          if (data.cr=="00"){
              this.detalle=true;       
              this.page = data.page;
              this.perPage = data.perPage;
              this.total = data.total;
              this.totalPages = data.totalPages;
              this.currentProdmat = data.objetoItem;
              this.currentuMDescripcion = data.uMDescripcion;
              for (let i=0; i < this.currentuMDescripcion.length; i++){ 
                  this.currentProdmat[i].uM = this.currentuMDescripcion[i]
              }
          }else{
              this.loading = false;
              this.msg = data.descripcion;
              this.alertService.error(this.msg);
        }
      },
        error => {
            this.alertService.error("No hay conexión con la Base de Datos");
            this.loading = false;
        });
  }  // Cierre del método consultaProdymat

  routeTo(clveProduc:string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewprodymat';
    this.router.navigate([this.returnUrl,clveProduc]);   
  }  
  
mudouPagina(evento) {
  this.perName = ""
  this.consultaProdymat(this.cveprod, evento.valor, this.perPage, this.perName); 
}

}
