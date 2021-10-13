import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, CteyprovService, AduanalService, SysdtapeService } from './../service';
import { Aduanal, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokaduanalComponent } from './../msgokaduanal/msgokaduanal.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

interface Tipo {
  Tipo: string;
  desc: string;
}

interface Mpo {
  id    : string;
  nombre: string;
}


@Component({
  selector: 'app-altaaduanal',
  templateUrl: './altaaduanal.component.html',
  styleUrls: ['./altaaduanal.component.css']
})
export class AltaaduanalComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1 = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  clvap: string;
  material: boolean=false;
  tipCteparam: boolean=false;
  altaaduanal: FormGroup;
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  submitted = false;
  msg= '';
  usuari: Login
  dataPais    : Sysdtape;
  orders = [];
  datacp: any=[];
  dataedo: any=[];
  datawork: any=[];
  dataworkrol: any=[];
  disponibles: any;
  selectedLocations: any = [];
  currString: string;

  indAct: string = "A";
  usuario: string;
  empresa: string;
  recinto: string;
  cvePrMt: string;
  progUser='SYSALTAS';
  
  loading = false;
  returnUrl: string;
  currentAduanal: Aduanal;
  tipProd:       string;  

  listTipcte = [];

  cteyprod: Tipo[] = [
    {Tipo: '1', desc: 'Contribuyente'},
    {Tipo: '2', desc: 'Cliente'},
    {Tipo: '3', desc: 'Destinatario'},
    {Tipo: '4', desc: 'Proveedor'},
    {Tipo: '5', desc: 'Transportista'}
  ];
 
  dataEdo: Mpo []=[];
  dataMpo: Mpo []=[];
  dataLoc: Mpo []=[];
  dataCol: Mpo []=[];
 

  constructor(
    private consape: SysdtapeService,
    @Inject(LOCALE_ID) public locale: string,
    private fb: FormBuilder,
    private cteyprovService: CteyprovService, 
    private aduanalService: AduanalService, 
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { 
  }

  ngOnInit(): void {
    this.submitted = true;
    this.formafb();
    this.consultaDatosApl();
    this.usuari = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario = this.usuari["idUsuario"];
    let empresa = this.usuari["idEmpresa"];
    let recinto = this.usuari["idRecinto"];
    this.usuario = usuario;
    this.empresa = empresa;
    this.recinto = recinto;
    if (this.tipCteparam) {
        for (let i=0; i < this.cteyprod.length; i++){ 
        if (this.cteyprod[i].Tipo == this.cvePrMt){
           this.altaaduanal.controls['tipCte'].setValue(this.cteyprod[i].desc);
        }
      }
      if (this.cvePrMt=='7'){
        this.material = true;
      }
    }
    //let userMod = this.usuari["idUsuario"];
  } // Cierre del método ngOnInit

  formafb() {
        this.altaaduanal = this.fb.group({
          'numPat':        new FormControl('',[Validators.required]),
          'nomAgAdu':      new FormControl('',[Validators.required]),
          'rFC':           new FormControl('',[Validators.required]),
          'cURP':          new FormControl('',[Validators.required]),
          'listaallpais':  new FormControl('',[Validators.required]),
          'calle':         new FormControl('',[Validators.required]),          
          'numExt':        new FormControl('',[Validators.required]),          
          'numINT':        new FormControl('',[Validators.required]),          
          'cP':            new FormControl('',[Validators.required]),
          'listaalledo':   new FormControl('',[Validators.required]),
          'listaallmpo':   new FormControl('',[Validators.required]),
          'listaallcol':   new FormControl('',[Validators.required]),
          'eMail':         new FormControl('',[Validators.required]),          
          'tel':           new FormControl('',[Validators.required])                   
    }); 
  } // Cierre del método formafb

  consultaDatosApl(){
    this.clvap = 'AP04';
    this.consape.apeconscve(this.clvap)
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
                this.dataPais = this.datawork.contenido;
                console.log("consultaDatosApl AP04")
                console.log(this.dataPais);
            }else {
                this.alertService.error("Error al obtener información de Países");
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en el Alta de Usuario");
            this.loading = false;
        });
  } // Cierre del método consultaDatosApl 

    obtenEdo(cp: any){
    this.dataEdo = [];
    this.dataMpo = [];
    this.dataCol = [];
    this.dataLoc = [];
   console.log("altaaduanal.ts obtencp cp") 
   console.log(cp.target.value)
   this.cteyprovService.obtenCP(cp.target.value)
   .pipe(first())
   .subscribe(
       data => {
        if (data.cr=="00"){         
            this.datacp = data.contenido    
            console.log("altaaduanal.component.ts obtenCP");            
            console.log(this.datacp);      
            for (let i=0; i < this.datacp.length; i++){ 
                 if (i>0){
                   console.log(this.datacp[i-1].cEstado)
                   console.log(this.datacp[i].cEstado)
                   if (this.datacp[i-1].cEstado != this.datacp[i].cEstado){
                       console.log("entre a diferentes")
                       this.dataEdo.push({id:this.datacp[i].cEstado,nombre:this.datacp[i].dEstado});
                   }
                 }else{
                  console.log("obtenEdo     i = 1")
                  console.log(this.datacp[i].cEstado)
                  this.dataEdo.push({id:this.datacp[i].cEstado,nombre:this.datacp[i].dEstado});
                 }
            }
         }else{
           this.loading = false;
           this.msg     = data.descripcion;
           this.alertService.error(this.msg);
         }
       error => {
         this.alertService.error("Error al obtener el Código Postal");
         this.loading = false;
       }
     });
  return   
  }       // Cierre del método obtenCP

  obtenMpo(listedoid: any){
    this.dataMpo = [];
    console.log("obtenMpo")
    console.log(listedoid.target.value)
    for (let i=0; i < this.datacp.length; i++) { 
      if (this.datacp[i].cEstado == listedoid.target.value){
        if (i>0){
          console.log(this.datacp[i-1].cMnpio)
          console.log(this.datacp[i].cMnpio)
          if (this.datacp[i-1].cMnpio != this.datacp[i].cMnpio){
              console.log("entre a diferentes mpo")
              this.dataMpo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
          }
        }else{
         console.log("entre a iguales mpo")
         this.dataMpo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
        }
      }
    }
  }

  obtenCol(listmpoid: any){
    this.dataCol = [];
    console.log("obtenCol")
    console.log(listmpoid.target.value)
    this.f.listaallmpo.patchValue(listmpoid.target.value);
    for (let i=0; i < this.datacp.length; i++) { 
      if (this.datacp[i].cMnpio == listmpoid.target.value){
        if (i>0){
          console.log(this.datacp[i-1].idAsentaCpcons)
          console.log(this.datacp[i].idAsentaCpcons)
          if (this.datacp[i-1].idAsentaCpcons != this.datacp[i].idAsentaCpcons){
              console.log("entre a diferentes col")
              this.dataCol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
          }
        }else{
         console.log("entre a iguales col")
         this.dataCol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
        }
      }
    }
  }
// convenience getter for easy access to form fields
    get f() { return this.altaaduanal.controls; }

  enviar() {
    if (this.altaaduanal.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
        console.log ("altaaduanal.component.ts enviar armausuario")    
        this.armausuario();
        for (let i=0; i < this.dataCol.length; i++) {
          if (this.dataCol[i].id == this.currentAduanal.localidad){
            this.currentAduanal.colonia = this.dataCol[i].nombre;
          }
        }
        console.log ("altaaduanal.component.ts enviar currentAduanal")
        console.log(this.currentAduanal)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
        this.aduanalService.altaaduanal(this.currentAduanal)
            .pipe(first())
            .subscribe(
                data => {
                    this.datawork = data;
                    if (this.datawork.cr=="00"){
                      this.msgokaduanal();
                  }else{
                    this.loading = false;
                    this.msg     = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                  }             
              error => {
                this.alertService.error("Error en el Alta de Productos y Materiales");
                this.loading = false;
              }
            });     
        return   
    } // Cierre del método enviar

  
    
  armausuario(){    
      this.currentAduanal = {
      numPat		    				: this.f.numPat.value ,
      nomAgAdu     					: this.f.nomAgAdu.value ,
      rFC          					: this.f.rFC.value ,
      cURP         					: this.f.cURP.value ,
      pais         					: this.f.listaallpais.value ,
      calle        					: this.f.calle.value ,
      numExt       					: this.f.numExt.value ,
      numINT       					: this.f.numINT.value ,
      cP           					: this.f.cP.value ,
      colonia      					: this.f.listaallcol.value ,
      estado       					: this.f.listaalledo.value ,
      municipio    					: this.f.listaallmpo.value ,
      localidad    					: this.f.listaallcol.value ,
      eMail        					: this.f.eMail.value ,
      tel          					: this.f.tel.value ,
                                                     
      idAct                 : this.indAct,
      empresa	              : this.empresa,               
      recinto               : this.recinto,                
      fechaAlta             : this.curr,                   
      fechaMod              : this.curr,                   
      hora                  : this.curr1,                  
      userMod               : this.usuario.substring(0, 8)   
      }    
  }     // Cierre del metodo armausuario

  
  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/aduanal';
    this.router.navigate([this.returnUrl]);   
  }  // Cierre del método cancelar


  msgokaduanal(): void {
    const dialogRef = this.dialog.open(MsgokaduanalComponent, {
      width: '400px',
      height: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }
} //Cierre principal