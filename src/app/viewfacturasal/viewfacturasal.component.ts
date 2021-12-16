import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, FacturasService } from './../service';
import { MatDialog} from '@angular/material/dialog';
import { DeletefacturaComponent } from '../deletefactura/deletefactura.component';
import { Login, Facturas } from './../model'

@Component({
  selector: 'app-viewfacturasal',
  templateUrl: './viewfacturasal.component.html',
  styleUrls: ['./viewfacturasal.component.css']
})
export class ViewfacturasalComponent implements OnInit {
  login               : Login;
  perfil              :boolean;
  currentFacturas     : Facturas;
  dataWork            : any=[];
  loading             = false;
  msg                 = '';
  returnUrl           : string; 
  
  page                = 1;
  perPage             = 6;
  perName             = "";
  total               : number;
  totalPages          : number;
  currentuMCDescripcion: string="" ;
  currentuPaisDescripcion: string="";
  currentProd         : string="";

  idCliProv						: string; 
  numPart							: string; 
  numFact             : string; 
  iDImpoEexpo         : string; 
  fechaEntrada        : string; 
  tipoCambio          : number; 
  paisFact            : string; 
  numPedimentoEntrada : string; 
  numPedimentoSalida  : string; 
  cLVPedi             : string; 
  numPate             : string; 
  aduana              : string; 
  producto            : string; 
  cantidad            : number; 
  costounitdls        : number; 
  costoTotaldls       : number; 
  costounitMXP        : number; 
  costototalMXP       : number; 
  unidadDeMedida      : string; 
  fraccAranc          : string; 
  netoOriginal        : number; 
  brutoOriginal       : number; 
  netoConv            : number; 
  brutoConv           : number; 
  transport           : string; 
  clieOrig            : string; 
  clieDest            : string; 
  iNCOTERM            : string; 
  nUMPlacaTr          : string; 
  nUMGuia             : string; 
  contCaja            : string; 
  selloCand1          : string; 
  selloCand2          : string; 
  selloCand3          : string; 
  nombChofTr          : string; 
  pO                  : string; 
  empresa             : string; 
  recinto             : string; 
  observaciones       : string; 
  fechaAlta           : string; 
  fechaMod            : string; 
  hora                : string; 
  userMod             : string; 
  estatus             : string; 

  constructor(
    private facturasService   : FacturasService,
    private activatedRoute    : ActivatedRoute,
    private route             : ActivatedRoute,
    private router            : Router,
    private dialog            : MatDialog,
    private alertService      : AlertService
    ) {
      this.activatedRoute.params.subscribe( params =>{ 
        this.facturasService.facturaUnica(params['cliente'],params['parte'],params['factura'])
        .pipe(first())
        .subscribe(
            data => {
              this.dataWork = data;
              if (data.cr=="00"){  
                  console.log("viewpartes.component prodymatUnico data")
                  console.log(data)
                  this.page                    = data.page                 ;
                  this.perPage                 = data.perPage              ;
                  this.total                   = data.total                ;
                  this.totalPages              = data.totalPages           ;
                  this.currentFacturas         = data.contenido            ;
                  this.currentuPaisDescripcion = data.descPais             ;
                  this.currentuMCDescripcion   = data.descUMC              ;
                  this.currentProd             = data.descCortaProd        ;

                  this.idCliProv						   = this.currentFacturas.idCliProv					 ,
                  this.numPart		  					 = this.currentFacturas.numPart						 ,
                  this.numFact                 = this.currentFacturas.numFact            ,
                  this.iDImpoEexpo             = this.currentFacturas.iDImpoEexpo        ,
                  this.fechaEntrada            = this.currentFacturas.fechaEntrada       ,
                  this.tipoCambio              = this.currentFacturas.tipoCambio         ,
                  this.paisFact                = this.currentuPaisDescripcion            ,
                  this.numPedimentoEntrada     = this.currentFacturas.numPedimentoEntrada,
                  this.numPedimentoSalida      = this.currentFacturas.numPedimentoSalida ,
                  this.cLVPedi                 = this.currentFacturas.cLVPedi            ,
                  this.numPate                 = this.currentFacturas.numPate            ,
                  this.aduana                  = this.currentFacturas.aduana             ,
                  this.producto                = this.currentProd                        ,
                  this.cantidad                = this.currentFacturas.cantidad           ,
                  this.costounitdls            = this.currentFacturas.costounitdls       ,
                  this.costoTotaldls           = this.currentFacturas.costoTotaldls      ,
                  this.costounitMXP            = this.currentFacturas.costounitMXP       ,
                  this.costototalMXP           = this.currentFacturas.costototalMXP      ,
                  this.unidadDeMedida          = this.currentuMCDescripcion              ,
                  this.fraccAranc              = this.currentFacturas.fraccAranc         ,
                  this.netoOriginal            = this.currentFacturas.netoOriginal       ,
                  this.brutoOriginal           = this.currentFacturas.brutoOriginal      ,
                  this.netoConv                = this.currentFacturas.netoConv           ,
                  this.brutoConv               = this.currentFacturas.brutoConv          ,
                  this.transport               = this.currentFacturas.transport          ,
                  this.clieOrig                = this.currentFacturas.clieOrig           ,
                  this.clieDest                = this.currentFacturas.clieDest           ,
                  this.iNCOTERM                = this.currentFacturas.iNCOTERM           ,
                  this.nUMPlacaTr              = this.currentFacturas.nUMPlacaTr         ,
                  this.nUMGuia                 = this.currentFacturas.nUMGuia            ,
                  this.contCaja                = this.currentFacturas.contCaja           ,
                  this.selloCand1              = this.currentFacturas.selloCand1         ,
                  this.selloCand2              = this.currentFacturas.selloCand2         ,
                  this.selloCand3              = this.currentFacturas.selloCand3         ,
                  this.nombChofTr              = this.currentFacturas.nombChofTr         ,
                  this.pO                      = this.currentFacturas.pO                 ,
                  this.empresa                 = this.currentFacturas.empresa            ,
                  this.recinto                 = this.currentFacturas.recinto            ,
                  this.observaciones           = this.currentFacturas.observaciones      ,
                  this.fechaAlta               = this.currentFacturas.fechaAlta          ,
                  this.fechaMod                = this.currentFacturas.fechaMod           ,
                  this.hora                    = this.currentFacturas.hora               ,
                  this.userMod                 = this.currentFacturas.userMod            ,
                  this.estatus                 = this.currentFacturas.estatus            
                  
                  if(this.iDImpoEexpo == "1"){
                     this.iDImpoEexpo = "Importación"
                  }
                  if(this.iDImpoEexpo == "2"){
                     this.iDImpoEexpo = "Exportación"
                  }
              }else{
                this.loading = false;
                this.msg = this.dataWork.descripcion;
                this.alertService.error(this.msg);
              }
            error => {
              this.alertService.error("Error en al visualizar el usuario");
              this.loading = false;
            }});   
      })
  }


  ngOnInit(): void {
    this.login = JSON.parse(localStorage.getItem('currentUserLog'));
    let perfillogin = this.login["idPerfil"];

    if (perfillogin=="US01"){
        this.perfil=true;      
    }else{
        this.perfil=false;
    }      
  }


  deletefactura(){
    const dialogRef = this.dialog.open(DeletefacturaComponent, {
      width: '400px',
      height: '200px',
      data: {idCliProv: this.idCliProv,numPart: this.numPart,numFact: this.numFact}
    });

    dialogRef.afterClosed().subscribe(result => {
//      this.id1 = result;
    });
  }

  
  editfactura(idCliProv:string, numPart: string, numFact: string){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/editfacturasal';
    this.router.navigate([this.returnUrl,{idCliProv: idCliProv, numPart: numPart, numFact: numFact}]);  
  }
}

