import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Login, Facturas} from './../model'
import { FacturasService, PartesService } from './../service';
import { first } from 'rxjs/operators';
import { AlertService } from './../service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facturasal',
  templateUrl: './facturasal.component.html',
  styleUrls: ['./facturasal.component.css']
})
export class FacturasalComponent implements OnInit {
  dataCli         : any[]=[];
  dataPart        : any[]=[];
  recinto         : string = "";
  login           : Login;  
  facturasForm    : FormGroup;
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
  currentFacturas : Facturas;
  descripcion     :string="";

  constructor(
    private formBuilder     : FormBuilder,
    private facturasService : FacturasService,
    private partesService   : PartesService,
    private alertService    : AlertService,
    private route           : ActivatedRoute,
    private router          : Router,
  ) {
  }

  ngOnInit(): void {
    this.catClientes();
    this.catPartsinCte();
    this.facturasForm = this.formBuilder.group({
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
  }
    // convenience getter for easy access to form fields
    get f() { return this.facturasForm.controls; }

    
  catClientes(){
    this.partesService.catClientes()
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataCli = data.contenido;
          }
        },
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Clientes");              
          this.loading = false;
        });
  } // Cierre del método catClientes

  
  catPartsinCte(){
    this.partesService.catPartsinCte()
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataPart = data.parteCliente;
          }
        },
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Partes");              
          this.loading = false;
        });
  } // Cierre del método catPartes


  consultaFacturas(idCliProv:string, numParte:string, page: number, perPage: number, perName: string)  {    
    this.idCliProv = idCliProv;
    this.numParte  = numParte;
    this.facturasService.FacturasCte(idCliProv, numParte, page, perPage, perName)
    .pipe(first())
    .subscribe(
      data => {
          if (data.cr=="00"){
              this.detalle       = true;       
              this.page          = data.contenido.page;
              this.perPage       = data.contenido.perPage;
              this.total         = data.contenido.total;
              this.totalPages    = data.contenido.totalPages;
              this.currentFacturas = data.contenido.sysAduFacturas;
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


  routeTo(idCliProv:string, numParte:string, numFact:string) : void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewfacturasal';
    this.router.navigate([this.returnUrl,{cliente:idCliProv,parte:numParte,factura:numFact}]);   
  }  
 
  
  mudouPagina(evento) {
    this.perName = ""
    this.consultaFacturas(this.idCliProv, this.numParte, evento.valor, this.perPage, this.perName); 
  }

}
