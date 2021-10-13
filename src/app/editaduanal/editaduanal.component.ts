import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, CteyprovService,SysdtapeService, AduanalService } from './../service';
import { Cteyprov, Sysdtape, Aduanal, Login } from '../model'
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
  selector: 'app-editaduanal',
  templateUrl: './editaduanal.component.html',
  styleUrls: ['./editaduanal.component.css']
})
export class EditaduanalComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1 = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  progUserc ='ALTAPROD';
  tipCteparam: boolean=false;
  material: boolean=false;
  usuario: string;
  empresaa: string;
  recintoo: string;
  dataPais    : Sysdtape;
  recintos: any[];
  editaduanal: FormGroup;
  usuari: Login
  loading = false;
  returnUrl: string;
  altausrrol: any =[];
  orders = [];
  clvap: string;
  indAct: string = "A";
  
  disponibles: any;
  selectedLocations: any = [];
  altauserrol = { appUserId: ' ', roleId: ' ' };
  msg= '';
  datawork: any=[];
  dataworkedit: any=[];
  currentCteyprov: Cteyprov;
  currentAduanal  : Aduanal;
  
  numPat		  : string;
  nomAgAdu    : string;
  rFC         : string;
  cURP        : string;
  pais        : string;
  calle       : string;
  numExt      : string;
  numINT      : string;
  cP          : string;
  colonia     : string;
  estado      : string;
  municipio   : string;
  localidad   : string;
  eMail       : string;
  tel         : string;
  idAct       : string;
  empresa     : string;
  recinto     : string;
  fechaAlta   : string;
  fechaMod    : string;
  hora        : string;
  userMod     : string;

  datacp      : any=[];

  dataEdo     : Mpo []=[];
  dataMpo     : Mpo []=[];
  dataLoc     : Mpo []=[];
  dataCol     : Mpo []=[];
  
  cteyprod: Tipo[] = [
    {Tipo: '1', desc: 'Contribuyente'},
    {Tipo: '2', desc: 'Cliente'},
    {Tipo: '3', desc: 'Destinatario'},
    {Tipo: '4', desc: 'Proveedor'},
    {Tipo: '5', desc: 'Transportista'}
  ];

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private consape: SysdtapeService,
    private aduanalService: AduanalService,
    private cteyprovService: CteyprovService,
    private activatedRoutee: ActivatedRoute,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private dialog: MatDialog,
  ) { 
// mimic async orders
    this.orders = this.getOrders();
  }
     
  ngOnInit(): void {
    this.consultaDatosApl();
    this.consultaDatosRecinto();
    this.formafb();
    this.consultaDatosAduanal(); 
    this.usuari = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario = this.usuari["idUsuario"];
    let empresa = this.usuari["idEmpresa"];
    let recinto = this.usuari["idRecinto"];
    this.usuario = usuario;
    this.empresa = empresa;
    this.recinto = recinto;
  }

  getOrders() {
    return [
      { id: "S", name: "SI" },
      { id: "N", name: "NO" }
    ];
  }

  consultaDatosApl(){
    this.clvap = 'AP04';
    this.consape.apeconscve(this.clvap)
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
                this.dataPais    = this.datawork.contenido;
            }else{
                this.alertService.error("Error al obtener claves de los países");
                this.loading = false;
            }
            error => {
              this.alertService.error("Error en el proceso de obtener las claves de países");
              this.loading = false;
            }});
  } // Cierre del método consultaDatosApl

  consultaDatosRecinto(){
    this.cteyprovService.consRecinto()
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
                this.recintos = this.datawork.contenido;
            }else{
                this.alertService.error("Error al obtener claves de los países");
                this.loading = false;
            }
            error => {
              this.alertService.error("Error en el proceso de obtener las claves de países");
              this.loading = false;
            }});
  } // Cierre del método consultaDatosApl

  
  formafb() {
    this.editaduanal = this.fb.group({
      'numPat':        new FormControl('',[Validators.required]),
      'nomAgAdu':      new FormControl('',[Validators.required]),
      'rFC':           new FormControl('',[Validators.required]),
      'cURP':          new FormControl('',[Validators.required]),
      'listaallpais':  new FormControl(''),
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
  
//this.sysdtapeService.apeconscveidid(params['clvap'],params['id1'],params['id2'])

  consultaDatosAduanal(){
    this.activatedRoutee.params.subscribe( params =>{ 
        this.aduanalService.aduanalUnico(params['numPat'])  
        .pipe(first())
        .subscribe( 
            data => {
                this.datawork = data;
                console.log("regreso editaduanal.component.ts consultaDatosAduanal data")
                console.log(data)
                if (this.datawork.cr=="00"){
                    this.currentAduanal     = this.datawork.contenido;
                    console.log("consultaDatosAduanal Unico currentAduanal")
                    console.log(this.currentAduanal)
                    console.log(this.currentAduanal.numPat)
                    this.editaduanal.controls['numPat'      ].setValue(this.currentAduanal.numPat      );
                    this.editaduanal.controls['nomAgAdu'    ].setValue(this.currentAduanal.nomAgAdu    );
                    this.editaduanal.controls['rFC'         ].setValue(this.currentAduanal.rFC         );
                    this.editaduanal.controls['cURP'        ].setValue(this.currentAduanal.cURP        );
                    this.editaduanal.controls['calle'       ].setValue(this.currentAduanal.calle       );
                    this.editaduanal.controls['numExt'      ].setValue(this.currentAduanal.numExt      );
                    this.editaduanal.controls['numINT'      ].setValue(this.currentAduanal.numINT      );
                    this.editaduanal.controls['cP'          ].setValue(this.currentAduanal.cP          );
                    this.editaduanal.controls['eMail'       ].setValue(this.currentAduanal.eMail       );
                    this.editaduanal.controls['tel'         ].setValue(this.currentAduanal.tel         );

                    this.numPat		    = this.currentAduanal.numPat    ; 
                    this.nomAgAdu     = this.currentAduanal.nomAgAdu  ; 
                    this.rFC          = this.currentAduanal.rFC       ; 
                    this.cURP         = this.currentAduanal.cURP      ; 
                    this.pais         = this.currentAduanal.pais      ; 
                    this.calle        = this.currentAduanal.calle     ; 
                    this.numExt       = this.currentAduanal.numExt    ; 
                    this.numINT       = this.currentAduanal.numINT    ; 
                    this.cP           = this.currentAduanal.cP        ; 
                    this.colonia      = this.currentAduanal.colonia.trim()   ; 
                    this.estado       = this.currentAduanal.estado.trim(); 
                    this.municipio    = this.currentAduanal.municipio.trim(); 
                    this.localidad    = this.currentAduanal.localidad.trim(); 
                    this.eMail        = this.currentAduanal.eMail     ; 
                    this.tel          = this.currentAduanal.tel       ; 
                    this.idAct        = this.currentAduanal.idAct     ; 
                    this.empresa      = this.currentAduanal.empresa   ; 
                    this.recinto      = this.currentAduanal.recinto   ; 
                    this.fechaAlta    = this.currentAduanal.fechaAlta ; 
                    this.fechaMod     = this.currentAduanal.fechaMod  ; 
                    this.hora         = this.currentAduanal.hora      ; 
                    this.userMod      = this.currentAduanal.userMod    
                                
                    this.obtenEdo(this.cP);
                }else{
                    this.loading = false;
                    this.msg     = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                }
            },
            error => {
                this.alertService.error("Error al momento de editar el agente aduanal");
                this.loading = false;
            });   
        })
  }     // Cierre del método consultaSysUser
     
  // convenience getter for easy access to form fields
    get f() { return this.editaduanal.controls; }

  cambio(tp: any){
    if (tp.target.value == '7'){
        this.material = true;
    }else{
       this.material = false;
       this.editaduanal.controls['tip_Mat'].setValue("");
    }
  }
  obtenEdop(cp: any){
    this.obtenEdo(cp.target.value)
    this.estado = "";
    this.municipio = "";
    this.colonia = "";
  }

  obtenEdo(cp: any){
      this.dataEdo  = [];
      this.dataMpo  = [];
      this.dataCol  = [];
      this.dataLoc  = [];
     console.log("editaduanal.component.ts obtencp cp") 
     console.log(cp)
//     console.log(cp.target.value)
     this.cteyprovService.obtenCP(cp)
     .pipe(first())
     .subscribe(
         data => {
          if (data.cr=="00"){         
              this.datacp = data.contenido    
              console.log("editaduanal.component.ts obtenCP");            
              console.log(this.datacp);      
              for (let i=0; i < this.datacp.length; i++){ 
                   if (i>0){
                     console.log(this.datacp[i-1].cEstado)
                     console.log(this.datacp[i].cEstado)
                     if (this.datacp[i-1].cEstado != this.datacp[i].cEstado){
                         console.log("entre a diferentes Edo")
                         console.log(this.estado)
                         this.dataEdo.push({id:this.datacp[i].cEstado,nombre:this.datacp[i].dEstado});
                         this.f.listaalledo.patchValue(this.estado);
                     }
                   }else{
                    console.log("entre a i = 1 ")
                    console.log(this.datacp[i].cEstado)
                    console.log(this.estado)
                    this.dataEdo.push({id:this.datacp[i].cEstado,nombre:this.datacp[i].dEstado});
                    this.f.listaalledo.patchValue(this.estado);
                    if (this.datacp[i].cEstado == this.estado ){
                      console.log(" SI SON IGUALESssssssssssssssssssss")
                    }
                   }
              }
              console.log(this.dataEdo)
              console.log("voy para alla")
              console.log(this.datacp);
              console.log(this.estado);
              this.obtenMpo(this.estado.trim())
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


  obtenMpop(listedoid: any){
    console.log("obtenMpop")
      console.log(listedoid.target.value)
      this.obtenMpo(listedoid.target.value)  
  }

  obtenMpo(listedoid: any){
    console.log("obtenMpo")
    console.log(listedoid)
      this.dataMpo = [];
      for (let i=0; i < this.datacp.length; i++) { 
        if (this.datacp[i].cEstado == listedoid){
          if (i>0){
            if (this.datacp[i-1].cMnpio != this.datacp[i].cMnpio){
                console.log("Mpo diferentes")
                console.log(this.datacp[i-1].cMnpio)
                console.log(this.datacp[i].cMnpio)
                this.dataMpo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
                this.f.listaallmpo.patchValue(this.municipio);
            }else{
                console.log("Mpo igualessssssssss")
                console.log(this.datacp)
                console.log(this.datacp[i-1].cMnpio)
                console.log(this.datacp[i].cMnpio)
//               this.dataMpo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
 //              this.f.listaallmpo.patchValue(this.municipio);
            }
         }else{
          this.dataMpo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
          this.f.listaallmpo.patchValue(this.municipio);
       }
      }
      }
      this.obtenCol(this.municipio.trim())
  }
  
  obtenColp(listmpoid: any){
    console.log("obten Colp")
    console.log(listmpoid.target.value)
    this.obtenCol(listmpoid.target.value)  
  }

  obtenCol(listmpoid: any){
    this.dataCol = [];
    console.log("obten Col")
    console.log(listmpoid)
    for (let i=0; i < this.datacp.length; i++) { 
      if (this.datacp[i].cMnpio == listmpoid){
        if (i>0){
          console.log(this.datacp[i-1].idAsentaCpcons)
          console.log(this.datacp[i].idAsentaCpcons)
          if (this.datacp[i-1].idAsentaCpcons != this.datacp[i].idAsentaCpcons){
              console.log("entre a diferentes col")
              //console.log(this.colonia)
              this.dataCol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
    //          this.f.listaallcol.patchValue(this.colonia);
          }else{
              console.log("entre a iguales col")
//              console.log(this.colonia)
//              this.dataCol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
  //            this.f.listaallcol.patchValue(this.colonia);
          }
        }else{
          this.dataCol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
//          this.f.listaallcol.patchValue(this.localidad);
        }
      }
    }
    console.log(this.localidad)
    console.log(this.colonia)
    this.f.listaallcol.patchValue(this.localidad);
  }    

  enviar() {

    if (this.editaduanal.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
   
        this.armausuario();

        for (let i=0; i < this.dataCol.length; i++) {
          if (this.dataCol[i].id == this.currentAduanal.localidad){
            this.currentAduanal.colonia = this.dataCol[i].nombre;
          }
        }
        console.log(this.currentAduanal)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/aduanal';
        this.aduanalService.editaduanal(this.currentAduanal)
          .pipe(first())
          .subscribe(
              data => {
                this.dataworkedit = data;
                if (this.dataworkedit.cr=="00"){
                    this.msgokaduanal();                    
                }
              },
              error => {
                this.alertService.error("Error al enviar el agente aduanal");
                this.loading = false;
              });    
    } //     Cierre del metodo enviar
  
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
      fechaAlta             : this.fechaAlta,
      fechaMod              : this.curr,                   
      hora                  : this.curr1,                  
      userMod               : this.usuario.substring(0, 8)   
      }    
      if (this.currentAduanal.pais == ""){
        this.currentAduanal.pais = this.pais;
      }
  }     // Cierre del metodo armausuario
    
  cancelar(clveProduc: string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/cteyprov';
    this.router.navigate([this.returnUrl]);   
  }     // Cierre del metodo cancelar
  
  msgokaduanal(): void {
    const dialogRef = this.dialog.open(MsgokaduanalComponent, {
      width: '400px',
      height: '200px',
      data: {numPat: this.numPat}
  });

  dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }    // Cierre del método msgok
}

