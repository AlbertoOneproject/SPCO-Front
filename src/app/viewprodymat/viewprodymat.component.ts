import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, ProdymatService } from './../service';
import { MatDialog} from '@angular/material/dialog';
import { DeleteprodymatComponent } from '../deleteprodymat/deleteprodymat.component';
import { Login, Prodymat } from './../model'

interface Tipo {
  Tipo: string;
  desc: string;
}


@Component({
  selector: 'app-viewprodymat',
  templateUrl: './viewprodymat.component.html',
  styleUrls: ['./viewprodymat.component.css']
})
export class ViewprodymatComponent implements OnInit {
  login: Login;
  perfil:boolean;
  currentProdmat: Prodymat;
  currentuMCDescripcion: string;
  currentuMTDescripcion: string;
  dataWork: any=[];
  loading = false;
  msg     = '';
  returnUrl:  string; 
  
  page    = 1;
  perPage = 6;
  perName = "";
  total:      number;
  totalPages: number;


  clveProduc:    string;
  tipProd:       string;  
  indVis:        string;
  descCorta:     string;
  descLarga:     string;
  descCorIng:    string;
  descLarIng:    string;
  uMC:           string;
  uMT:           string;
  Tip_Mat:       string;
  empresa:       string;
  recinto:       string;
  fechaAlta:     string;
  fechaMod:      string;
  hora:          string;
  userMod:       string;
  convers:       number; 
  costoUnitDLS:  number;
  costoUnitMXP:  number;
  monedaMandataria:  string;
  fraccAranc:    string;
  nico:          string;

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
                  this.page = data.page;
                  this.perPage = data.perPage;
                  this.total = data.total;
                  this.totalPages = data.totalPages;
                  this.currentProdmat = data.contenido;
                  this.currentuMCDescripcion = data.uMCDescripcion;
                  this.currentuMTDescripcion = data.uMTDescripcion;
                  this.currentProdmat.uMC = this.currentuMCDescripcion
                  this.currentProdmat.uMT = this.currentuMTDescripcion
                  this.clveProduc			= this.currentProdmat.clveProduc  ,
                  this.tipProd        = this.currentProdmat.tipProd     ,
                  this.indVis         = this.currentProdmat.indVis      ,
                  this.descCorta      = this.currentProdmat.descCorta   ,
                  this.descLarga      = this.currentProdmat.descLarga   ,
                  this.descCorIng     = this.currentProdmat.descCorIng  ,
                  this.descLarIng     = this.currentProdmat.descLarIng  ,
                  this.uMC            = this.currentProdmat.uMC        ,
                  this.uMT            = this.currentProdmat.uMT        ,
                  this.Tip_Mat        = this.currentProdmat.tipMat     ,                  
                  this.empresa        = this.currentProdmat.empresa     ,
                  this.recinto        = this.currentProdmat.recinto     ,
                  this.fechaAlta      = this.currentProdmat.fechaAlta   ,
                  this.fechaMod       = this.currentProdmat.fechaMod    ,
                  this.hora           = this.currentProdmat.hora        ,
                  this.userMod        = this.currentProdmat.userMod     ,
                  this.convers        = this.currentProdmat.convers     ,
                  this.costoUnitDLS   = this.currentProdmat.costoUnitDLS,
                  this.costoUnitMXP   = this.currentProdmat.costoUnitMXP,
                  this.monedaMandataria = this.currentProdmat.monedaMandataria  ;
                  this.fraccAranc     = this.currentProdmat.fraccAranc  ,
                  this.nico           = this.currentProdmat.nico
              }else{
                this.loading = false;
                this.msg = this.dataWork.descripcion;
                this.alertService.error(this.msg);
              }
              for (let i=0; i < this.prod.length; i++){ 
                if (this.prod[i].Tipo == this.tipProd){
                  this.tipProd = this.prod[i].desc;
                }
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

  deleteprod(){
    const dialogRef = this.dialog.open(DeleteprodymatComponent, {
      width: '400px',
      height: '200px',
      data: {clveProduc: this.clveProduc}
    });

    dialogRef.afterClosed().subscribe(result => {
//      this.id1 = result;
    });
  }

  ireditprod(clveProduc:string){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/editprodymat';
    this.router.navigate([this.returnUrl,clveProduc]);  
  }

}
