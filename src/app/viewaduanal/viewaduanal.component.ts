import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, AduanalService } from './../service';
import { MatDialog} from '@angular/material/dialog';
import { DeleteaduanalComponent } from '../deleteaduanal/deleteaduanal.component';
import { Login, Aduanal } from './../model'

@Component({
  selector: 'app-viewaduanal',
  templateUrl: './viewaduanal.component.html',
  styleUrls: ['./viewaduanal.component.css']
})
export class ViewaduanalComponent implements OnInit {
  login               : Login;
  perfil              :boolean;
  currentAduanal      : Aduanal;
  dataWork            : any=[];
  loading             = false;
  msg                 = '';
  returnUrl           : string; 
  
  page                = 1;
  perPage             = 6;
  perName             = "";
  total               : number;
  totalPages          : number;
  currentEstado       : string="";
  currentLocalidad    : string="";
  currentMunicipio    : string="";
  currentuPaisDescripcion: string="";

  numPat		          : string;
  nomAgAdu            : string;
  rFC                 : string;
  cURP                : string;
  pais                : string;
  calle               : string;
  numExt              : string;
  numINT              : string;
  cP                  : string;
  colonia             : string;
  estado              : string;
  municipio           : string;
  localidad           : string;
  eMail               : string;
  tel                 : string;
  idAct               : string;
  empresa             : string;
  recinto             : string;
  fechaAlta           : string;
  fechaMod            : string;
  hora                : string;
  userMod             : string;

  constructor(
    private aduanalService    : AduanalService,
    private activatedRoute    : ActivatedRoute,
    private route             : ActivatedRoute,
    private router            : Router,
    private dialog            : MatDialog,
    private alertService      : AlertService
    ) {
      this.activatedRoute.params.subscribe( params =>{ 
        this.aduanalService.aduanalUnico(params['numPat'])
        .pipe(first())
        .subscribe(
            data => {
              this.dataWork = data;
              if (data.cr=="00"){  
                  console.log("viewaduanal.component aduanaUnico data")
                  console.log(data)
                  this.page                    = data.page                 ;
                  this.perPage                 = data.perPage              ;
                  this.total                   = data.total                ;
                  this.totalPages              = data.totalPages           ;
                  this.currentAduanal          = data.contenido            ;

                  this.currentuPaisDescripcion = data.descPais             ;
                  this.currentLocalidad        = data.desLocal             ;
                  this.currentMunicipio        = data.descMunic            ;
                  this.currentEstado           = data.descEstado           ;

                  this.numPat		     					= this.currentAduanal.numPat    , 
                  this.nomAgAdu     					= this.currentAduanal.nomAgAdu  , 
                  this.rFC          					= this.currentAduanal.rFC       , 
                  this.cURP         					= this.currentAduanal.cURP      , 
                  this.pais         					= this.currentuPaisDescripcion  , 
                  this.calle        					= this.currentAduanal.calle     , 
                  this.numExt       					= this.currentAduanal.numExt    , 
                  this.numINT       					= this.currentAduanal.numINT    , 
                  this.cP           					= this.currentAduanal.cP        , 
                  this.colonia      					= this.currentAduanal.colonia   , 
                  this.estado       					= this.currentEstado            , 
                  this.municipio    					= this.currentMunicipio         , 
                  this.localidad    					= this.currentLocalidad         , 
                  this.eMail        					= this.currentAduanal.eMail     , 
                  this.tel          					= this.currentAduanal.tel       , 
                  this.idAct        					= this.currentAduanal.idAct     , 
                  this.empresa      					= this.currentAduanal.empresa   , 
                  this.recinto      					= this.currentAduanal.recinto   , 
                  this.fechaAlta    					= this.currentAduanal.fechaAlta , 
                  this.fechaMod     					= this.currentAduanal.fechaMod  , 
                  this.hora         					= this.currentAduanal.hora      , 
                  this.userMod      					= this.currentAduanal.userMod     
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

  deleteaduanal(){
    console.log("delete aduanal")
    console.log(this.numPat)
    const dialogRef = this.dialog.open(DeleteaduanalComponent, {
      width: '400px',
      height: '200px',
      data: {numPat: this.numPat}
    });

    dialogRef.afterClosed().subscribe(result => {
//      this.id1 = result;
    });
  }

  editaduanal(numPat:string){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/editaduanal';
    console.log("voy para edit")
    console.log(numPat)
    this.router.navigate([this.returnUrl,numPat]);  
  }
}