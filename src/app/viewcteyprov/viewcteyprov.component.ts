
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, CteyprovService } from './../service';
import { MatDialog} from '@angular/material/dialog';
import { DeleteprodymatComponent } from '../deleteprodymat/deleteprodymat.component';
import { Login, Cteyprov } from './../model'

interface Tipo {
  Tipo: string;
  desc: string;
}

@Component({
  selector: 'app-viewcteyprov',
  templateUrl: './viewcteyprov.component.html',
  styleUrls: ['./viewcteyprov.component.css']
})
export class ViewcteyprovComponent implements OnInit {
  login: Login;
  perfil:boolean;
  currentCteyprov: Cteyprov;
  currentuMDescripcion: string;
  dataWork: any=[];
  loading = false;
  msg     = '';
  returnUrl:  string; 

  recinto				: string;
  empresa				: string;
  nomDenov			: string;
  idCliProv			: string;
  rfc					  : string;
  immexCveRec		: number;
  nomContacto		: string;
  nal					  : string;
  idTax				  : string;
  pais			  	: string;
  colonia				: string;
  curp				  : string;
  estado				: string;
  numExt				: string;
  numInte				: string;
  cp	  				: string;
  calle	  			: string;
  localidad			: string;
  municipio			: string;
  email			  	: string;
  userMod				: string;
  tel			  		: number;
  tipo			  	: string;
  indAct				: string;
  fechaMod			: string;
  hora	  			: string;
  fechaAlta			: string;

  page    = 1;
  perPage = 6;
  perName = "";
  total:      number;
  totalPages: number;

  cteyprod: Tipo[] = [
    {Tipo: '1', desc: 'Contribuyente'},
    {Tipo: '2', desc: 'Cliente'},
    {Tipo: '3', desc: 'Destinatario'},
    {Tipo: '4', desc: 'Proveedor'},
    {Tipo: '5', desc: 'Transportista'}
  ];

  constructor(    
    private cteyprovService: CteyprovService,
    private activatedRoute: ActivatedRoute,
    private route:          ActivatedRoute,
    private router:         Router,
    private dialog:         MatDialog,
    private alertService:   AlertService
    ) { 

      this.activatedRoute.params.subscribe( params =>{ 
        this.cteyprovService.cteyprovUnico(params['idCliProv'])
        .pipe(first())
        .subscribe(
            data => {
              this.dataWork = data;
              if (data.cr=="00"){  
                  this.page = data.page;
                  this.perPage = data.perPage;
                  this.total = data.total;
                  this.totalPages = data.totalPages;
                  this.currentCteyprov = data.contenido;
                  this.currentuMDescripcion = data.uMDescripcion;
//                  this.currentCteyprov.uM = this.currentuMDescripcion

                  this.recinto			  = this.currentCteyprov.recinto			,  
                  this.empresa			  = this.currentCteyprov.empresa			,  
                  this.nomDenov		    = this.currentCteyprov.nomDenov		  ,    
                  this.idCliProv		  = this.currentCteyprov.idCliProv		,  
                  this.rfc					  = this.currentCteyprov.rfc					,  
                  this.immexCveRec	  = this.currentCteyprov.immexCveRec	,  
                  this.nomContacto	  = this.currentCteyprov.nomContacto	,  
                  this.nal					  = this.currentCteyprov.nal					,  
                  this.idTax				  = this.currentCteyprov.idTax				,  
                  this.pais			      = this.currentCteyprov.país			    ,    
                  this.colonia			  = this.currentCteyprov.colonia			,  
                  this.curp				    = this.currentCteyprov.curp				  ,    
                  this.estado			    = this.currentCteyprov.estado			  ,    
                  this.numExt			    = this.currentCteyprov.numExt			  ,    
                  this.numInte			  = this.currentCteyprov.numInte			,  
                  this.cp	  			    = this.currentCteyprov.cp	  			  ,    
                  this.calle	  		  = this.currentCteyprov.calle	  		,  
                  this.localidad		  = this.currentCteyprov.localidad		,  
                  this.municipio		  = this.currentCteyprov.municipio		,  
                  this.email			    = this.currentCteyprov.email			  ,  
                  this.userMod			  = this.currentCteyprov.userMod			,  
                  this.tel			  	  = this.currentCteyprov.tel			  	,  
                  this.tipo			      = this.currentCteyprov.tipo			    ,    
                  this.indAct			    = this.currentCteyprov.indAct			  ,    
                  this.fechaMod		    = this.currentCteyprov.fechaMod		  ,    
                  this.hora	  		    = this.currentCteyprov.hora	  		  ,    
                  this.fechaAlta		  = this.currentCteyprov.fechaAlta		  
                  
              }else{
                this.loading = false;
                this.msg = this.dataWork.descripcion;
                this.alertService.error(this.msg);
              }
              for (let i=0; i < this.cteyprod.length; i++){ 
                if (this.cteyprod[i].Tipo == this.tipo){
                  this.tipo = this.cteyprod[i].desc;
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

  deletecteyprov(){
    const dialogRef = this.dialog.open(DeleteprodymatComponent, {
      width: '400px',
      height: '200px',
      data: {idCliProv: this.idCliProv}
    });

    dialogRef.afterClosed().subscribe(result => {
//      this.id1 = result;
    });
  }

  ireditcteyprov(idCliProv:string){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/editcteyprov';
    this.router.navigate([this.returnUrl,idCliProv]);  
  }

}
