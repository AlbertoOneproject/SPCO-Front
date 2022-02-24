import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, PartesService, FacturasService, ProdymatService, ShareService, TraspasosService } from './../service';
import { Login, Prodymat, Traspasos } from '../model'
import { first } from 'rxjs/operators';
import { MsgoktComponent } from './../msgokt/msgokt.component'
import { MsgoktrComponent } from './../msgoktr/msgoktr.component'
import { DeletetraspComponent } from '../deletetrasp/deletetrasp.component';
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';



@Component({
  selector: 'app-viewtraspasos',
  templateUrl: './viewtraspasos.component.html',
  styleUrls: ['./viewtraspasos.component.css']
})
export class ViewtraspasosComponent implements OnInit {
  login               : Login;
  perfil              : boolean;
  currentTrasp        : Traspasos;
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
  descrProd           : string;

  empresa             : string;
  recinto             : string;
  idCliProv 	        : string;
  recintoDest         : string;
  idCliProvDest       : string;
  numPart		    	    : string;
  numFact             : string;
  numPedimentoEntrada : string;
  estatus             : string;
  producto            : string;
  cantidad            : string;
  fechaAlta           : string;
  fechaMod            : string;
  hora                : string;
  userMod             : string;
  entSal              : string;
  numFactEnt          : string;

  constructor(
    private activatedRoute    : ActivatedRoute,
    private route             : ActivatedRoute,
    private router            : Router,
    private dialog            : MatDialog,
    private alertService      : AlertService,
    private traspasosService  : TraspasosService,
    
    ) {
      this.activatedRoute.params.subscribe( params =>{ 
        this.traspasosService.viewTraspasoDesc(params['cliente'],params['parte'],params['factura'],params['pedimento'])
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
                  this.currentTrasp            = data.contenido            ;
                  this.currentuPaisDescripcion = data.descPais             ;
                  this.currentuMCDescripcion   = data.descUMC              ;
                  this.currentProd             = data.descCortaProd        ;
                  this.descrProd               = data.descripcionProd      ;

                  this.empresa                 = this.currentTrasp.empresa             , 
                  this.recinto                 = this.currentTrasp.recinto             , 
                  this.idCliProv 	             = this.currentTrasp.idCliProv 	         , 
                  this.recintoDest             = this.currentTrasp.recintoDest         , 
                  this.idCliProvDest           = this.currentTrasp.idCliProvDest       , 
                  this.numPart		    	       = this.currentTrasp.numPart		    	   , 
                  this.numFact                 = this.currentTrasp.numFact             , 
                  this.numPedimentoEntrada     = this.currentTrasp.numPedimentoEntrada , 
                  this.estatus                 = this.currentTrasp.estatus             , 
                  this.producto                = this.currentTrasp.producto            , 
                  this.cantidad                = this.currentTrasp.cantidad            , 
                  this.fechaAlta               = this.currentTrasp.fechaAlta           , 
                  this.fechaMod                = this.currentTrasp.fechaMod            , 
                  this.hora                    = this.currentTrasp.hora                , 
                  this.userMod                 = this.currentTrasp.userMod             , 
                  this.entSal                  = this.currentTrasp.entSal              , 
                  this.numFactEnt              = this.currentTrasp.numFactEnt           
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


  deletetraspaso(idCliProv:string, numPart: string, numFact: string, numPedi: string){
    const dialogRef = this.dialog.open(DeletetraspComponent, {
      width: '400px',
      height: '200px',
      data: {idCliProv:idCliProv, numPart: numPart, numFact: numFact, numPedi: numPedi}
    });

    dialogRef.afterClosed().subscribe(result => {
//      this.id1 = result;
    });
  }

  
  edittraspaso(idCliProv:string, numPart: string, numFact: string, numPedi: string){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/edittraspasos';
    this.router.navigate([this.returnUrl,{idCliProv: idCliProv, numPart: numPart, numFact: numFact, numPedi: numPedi}]);  

  }
}
