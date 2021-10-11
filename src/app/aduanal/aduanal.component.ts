import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Login, Facturas, Aduanal} from './../model'
import { FacturasService, PartesService, AduanalService } from './../service';
import { first } from 'rxjs/operators';
import { AlertService } from './../service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aduanal',
  templateUrl: './aduanal.component.html',
  styleUrls: ['./aduanal.component.css']
})
export class AduanalComponent implements OnInit {
  dataListAduanal : any[]=[];
  dataWork        : any[]=[];

  recinto         : string = "";
  login           : Login;  
  aduanalForm     : FormGroup;
  paginacion      : boolean;
  detalle         : boolean;
  perfil          :boolean;
  loading         = false;
  page            : number = 1;
  perPage         : number = 6;
  perName         : string = "";
  total           : number;
  totalPages      : number;
  msg             = '';
  idCliProv       : string = "0";
  numParte        : string = "0";
  returnUrl       : string;
  currentAduanal  : Aduanal[]=[];
  descripcion     :string="";

  constructor(
    private formBuilder     : FormBuilder,
    private facturasService : FacturasService,
    private partesService   : PartesService,
    private aduanalService  : AduanalService,
    private alertService    : AlertService,
    private route           : ActivatedRoute,
    private router          : Router,
  ) {
   }

  ngOnInit(): void {
    this.llenaAduanal()
    this.listaAduanal();
    this.aduanalForm = this.formBuilder.group({
      'listaCtes':new FormControl('', [Validators.required]),
      'listaPart':new FormControl('', [Validators.required]),
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
    this.paginacion=false;
  }
    // convenience getter for easy access to form fields
    get f() { return this.aduanalForm.controls; }

    llenaAduanal()  {    
      this.aduanalService.llenaAduanal(this.page, this.perPage)
      .pipe(first())
      .subscribe(
        data => {
          console.log("llenaAduanal   Data")  
          console.log(data)        

            if (data.cr=="00"){
                this.detalle         = true;     
                this.paginacion      = true;  
                
                this.page            = data.contenido.page;
                this.perPage         = data.contenido.perPage;
                this.total           = data.contenido.total;
                this.totalPages      = data.contenido.totalPages;
                this.currentAduanal  = data.contenido.sysAgads;
                console.log("llenaAduanal currentAduanal")
                console.log(this.currentAduanal)  
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
    }  // Cierre del método llenaAduanal

    
  listaAduanal(){
    this.aduanalService.listaAduanal()
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){  
            console.log("lista Aduanal   Data")  
            console.log(data)        
             this.dataListAduanal = data.contenido;
          }
        },
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Clientes");              
          this.loading = false;
        });
  } // Cierre del método catClientes


  consultaAduanal(numPat:string)  {   
    console.log("consultaAduanal") 
    console.log(numPat)
    this.aduanalService.aduanalUnico(numPat)
    .pipe(first())
    .subscribe(
      data => {
          if (data.cr=="00"){
            console.log("consultaAduanal data")
            console.log(data)  
              this.detalle       = true;   
              this.paginacion    = true;
              console.log(this.paginacion)  
              
              this.page          = 1;
              this.perPage       = 6;
              this.total         = 4;
              this.totalPages    = 1;              
              this.currentAduanal = [];
              this.dataWork        = [];
              this.dataWork.push(data.contenido);
              console.log("consultaAduanal dataWork")
              console.log(this.dataWork);
              this.currentAduanal[0] = this.dataWork[0] ;
              console.log("consultaAduanal currentAduanal")
              console.log(this.currentAduanal)  
  
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

  routeTo(numPat:string) : void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewaduanal';
    this.router.navigate([this.returnUrl,numPat]);   
  }  
  
  mudouPagina(evento) {
    this.perName = ""
    this.llenaAduanal(); 
//    this.llenaAduanal(this.numPat, evento.valor, this.perPage, this.perName); 
  }

}
