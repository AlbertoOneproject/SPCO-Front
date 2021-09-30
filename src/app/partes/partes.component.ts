import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Login, Partes} from './../model'
import { PartesService } from './../service';
import { first } from 'rxjs/operators';
import { AlertService } from './../service';
import { Router, ActivatedRoute } from '@angular/router';

interface Tipo {
  Tipo: string;
  desc: string;
}

@Component({
  selector: 'app-partes',
  templateUrl: './partes.component.html',
  styleUrls: ['./partes.component.css']
})
export class PartesComponent implements OnInit {
  dataCli       : any[]=[];
  recinto       : string = "";
  login         : Login;  
  partesForm    : FormGroup;
  detalle       : boolean;
  perfil        :boolean;
  loading       = false;
  page          : number = 1;
  perPage       : number = 6;
  perName       : string = "";
  total         : number;
  totalPages    : number;
  msg           = '';
  cveparte      : string = "0";
  returnUrl     : string;
  currentPartes : Partes;
  descripcion   :string="";
  //partes: Partes;
  //currentuMCDescripcion: any[];
  //currentuMTDescripcion: any[];
  
  prod: Tipo[] = [
    {Tipo: '6', desc: 'Productos'},
    {Tipo: '7', desc: 'Materiales'},
    {Tipo: '8', desc: 'Activo Fijo'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private partesService: PartesService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
   //this.page = 1;
   //this.perPage = 6;
   //this.perName = "";
   }

  ngOnInit(): void {
    this.catClientes();
    this.partesForm = this.formBuilder.group({
      'listaCtes':new FormControl('', [Validators.required]),
    });

    this.login      = JSON.parse(localStorage.getItem('currentUserLog'));
    let perfillogin = this.login["idPerfil"];
    let recinto     = this.login["idRecinto"];
    this.recinto    = recinto;
    if (perfillogin =="US01"){
        this.perfil=true;      
    }else{
        this.perfil=false;
    }
    this.detalle=false;      
  }
    // convenience getter for easy access to form fields
    get f() { return this.partesForm.controls; }

  catClientes(){
    this.partesService.catClientes()
    .pipe(first())
    .subscribe(
        data => {
          console.log("partes.component catClientes data")
          console.log(data)
          if (data.cr=="00"){          
             this.dataCli = data.contenido;
             console.log(this.dataCli)
        }},
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Clientes");              
          this.loading = false;
        });
  } // Cierre del método catClientes

  consultaPartes(cveparte:string, page: number, perPage: number, perName: string)  {    
//    this.descripcion = cvedesc;
    this.cveparte = cveparte;
    console.log("prodymat.component cveparte")
    console.log(this.cveparte)
    console.log(this.recinto)
    this.partesService.PartesCte(cveparte, this.recinto, page, perPage, perName)
    .pipe(first())
    .subscribe(
      data => {
          if (data.cr=="00"){
              this.detalle       = true;       
              this.page          = data.contenido.page;
              this.perPage       = data.contenido.perPage;
              this.total         = data.contenido.total;
              this.totalPages    = data.contenido.totalPages;
              this.currentPartes = data.contenido.sysAduPartes;
//              this.currentuMCDescripcion = data.uMCDescripcion;
//              for (let i=0; i < this.currentuMCDescripcion.length; i++){ 
 //                 this.currentProdmat[i].uM = this.currentuMCDescripcion[i]
 //             }
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

  routeTo(idCliProv:string, parte:string, pedimento:string) : void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewpartes';
    this.router.navigate([this.returnUrl,{idCliProv:idCliProv,parte:parte,pedimento:pedimento}]);   
  }  
  
  mudouPagina(evento) {
    this.perName = ""
    this.consultaPartes(this.cveparte, evento.valor, this.perPage, this.perName); 
  }

}
