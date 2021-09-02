import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, ProdymatService } from './../service';
import { MatDialog} from '@angular/material/dialog';
import { DeleteprodymatComponent } from '../deleteprodymat/deleteprodymat.component';
import { Login, Prodymat } from './../model'


@Component({
  selector: 'app-viewprodymat',
  templateUrl: './viewprodymat.component.html',
  styleUrls: ['./viewprodymat.component.css']
})
export class ViewprodymatComponent implements OnInit {
  login: Login;
  perfil:boolean;
  currentProdmat: Prodymat;
  currentuMDescripcion: string;
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
  uM:            string;
  empresa:       string;
  recinto:       string;
  fechaAlta:     string;
  fechaMod:      string;
  hora:          string;
  userMod:       string;
  tip_Mat:       string;

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
                  this.page = data.page;
                  this.perPage = data.perPage;
                  this.total = data.total;
                  this.totalPages = data.totalPages;
                  this.currentProdmat = data.contenido;
                  this.currentuMDescripcion = data.uMDescripcion;
                  this.currentProdmat.uM = this.currentuMDescripcion
                  this.clveProduc			= this.currentProdmat.clveProduc,
                  this.tipProd        = this.currentProdmat.tipProd   ,
                  this.indVis         = this.currentProdmat.indVis    ,
                  this.descCorta      = this.currentProdmat.descCorta ,
                  this.descLarga      = this.currentProdmat.descLarga ,
                  this.descCorIng     = this.currentProdmat.descCorIng,
                  this.descLarIng     = this.currentProdmat.descLarIng,
                  this.uM             = this.currentProdmat.uM        ,
                  this.empresa        = this.currentProdmat.empresa   ,
                  this.recinto        = this.currentProdmat.recinto   ,
                  this.fechaAlta      = this.currentProdmat.fechaAlta ,
                  this.fechaMod       = this.currentProdmat.fechaMod  ,
                  this.hora           = this.currentProdmat.hora      ,
                  this.userMod        = this.currentProdmat.userMod   ,
                  this.tip_Mat        = this.currentProdmat.tip_Mat                     
              }else{
                this.loading = false;
                this.msg = this.dataWork.descripcion;
                this.alertService.error(this.msg);
              }
            },
            error => {
              this.alertService.error("Error en al visualizar el usuario");
              this.loading = false;
            });   
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
