import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, ProdymatService } from './../service';
import { MatDialog} from '@angular/material/dialog';
import { DeleteprodymatComponent } from '../deleteprodymat/deleteprodymat.component';
import { Login, Partes } from './../model'

interface Tipo {
  Tipo: string;
  desc: string;
}
@Component({
  selector: 'app-viewpartes',
  templateUrl: './viewpartes.component.html',
  styleUrls: ['./viewpartes.component.css']
})
export class ViewpartesComponent implements OnInit {
  login         : Login;
  perfil        :boolean;
  currentPartes : Partes;
  dataWork      : any=[];
  loading       = false;
  msg           = '';
  returnUrl     : string; 
  
  page          = 1;
  perPage       = 6;
  perName       = "";
  total         : number;
  totalPages    : number;


  idCliProv	    : string;
  numPart       : string;
  numPedimento  : string;
  fechaAlta     : string;
  fechaEntrada  : string;
  producto      : string;
  paisOrigen    : string;
  cantidad      : number;
  costounitdls  : number;
  costoTotaldls : number;
  costounitMXP  : number;
  costototalMXP : number;
  tipCambio     : number;
  uMC           : string;
  uMT           : string;
  fraccAranc    : string;
  nico          : string;
  netoOriginal  : number;
  brutoOriginal : number;
  netoConv      : number;
  brutoConv     : number;
  fechaVenc     : string;
  empresa       : string;
  recinto       : string;
  fechaRegistro : string;
  fechaMod      : string;
  hora          : string;
  userMod       : string;


  prod: Tipo[] = [
    {Tipo: '6', desc: 'Productos'},
    {Tipo: '7', desc: 'Materiales'},
    {Tipo: '8', desc: 'Activo Fijo'}
  ];

  constructor(    
    private prodymatService: ProdymatService,
    private activatedRoute: ActivatedRoute,
    private route:          ActivatedRoute,
    private router:         Router,
    private dialog:         MatDialog,
    private alertService:   AlertService
    ) { 
      this.activatedRoute.params.subscribe( params =>{ 
        this.prodymatService.prodymatUnico(params['clveProduc'])
        .pipe(first())
        .subscribe(
            data => {
              this.dataWork = data;
              if (data.cr=="00"){  
                  console.log("viewprodymat.component prodymatUnico data")
                  console.log(data)
                  this.page            = data.page                       ;
                  this.perPage         = data.perPage                    ;
                  this.total           = data.total                      ;
                  this.totalPages      = data.totalPages                 ;
                  this.currentPartes   = data.contenido                  ;

                  this.idCliProv       = this.currentPartes.idCliProv    ,  
                  this.numPart         = this.currentPartes.numPart      ,  
                  this.numPedimento    = this.currentPartes.numPedimento ,  
                  this.fechaAlta       = this.currentPartes.fechaAlta    ,  
                  this.fechaEntrada    = this.currentPartes.fechaEntrada ,  
                  this.producto        = this.currentPartes.producto     ,  
                  this.paisOrigen      = this.currentPartes.paisOrigen   ,  
                  this.cantidad        = this.currentPartes.cantidad     ,  
                  this.costounitdls    = this.currentPartes.costounitdls ,  
                  this.costoTotaldls   = this.currentPartes.costoTotaldls,  
                  this.costounitMXP    = this.currentPartes.costounitMXP ,  
                  this.costototalMXP   = this.currentPartes.costototalMXP,  
                  this.tipCambio       = this.currentPartes.tipCambio    ,  
                  this.uMC             = this.currentPartes.uMC          ,  
                  this.uMT             = this.currentPartes.uMT          ,  
                  this.fraccAranc      = this.currentPartes.fraccAranc   ,  
                  this.nico            = this.currentPartes.nico         ,  
                  this.netoOriginal    = this.currentPartes.netoOriginal ,  
                  this.brutoOriginal   = this.currentPartes.brutoOriginal,  
                  this.netoConv        = this.currentPartes.netoConv     ,  
                  this.brutoConv       = this.currentPartes.brutoConv    ,  
                  this.fechaVenc       = this.currentPartes.fechaVenc    ,  
                  this.empresa         = this.currentPartes.empresa      ,  
                  this.recinto         = this.currentPartes.recinto      ,  
                  this.fechaRegistro   = this.currentPartes.fechaRegistro,  
                  this.fechaMod        = this.currentPartes.fechaMod     ,  
                  this.hora            = this.currentPartes.hora         ,  
                  this.userMod         = this.currentPartes.userMod        
              }else{
                this.loading = false;
                this.msg = this.dataWork.descripcion;
                this.alertService.error(this.msg);
              }
//              for (let i=0; i < this.prod.length; i++){ 
//                if (this.prod[i].Tipo == this.tipProd){
 //                 this.tipProd = this.prod[i].desc;
//                }
  //            }
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

  deleteparte(){
    const dialogRef = this.dialog.open(DeleteprodymatComponent, {
      width: '400px',
      height: '200px',
      data: {idCliProv: this.idCliProv}
    });

    dialogRef.afterClosed().subscribe(result => {
//      this.id1 = result;
    });
  }

  editparte(idCliProv:string){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/editpartes';
    this.router.navigate([this.returnUrl,idCliProv]);  
  }

}