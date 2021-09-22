import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, CteyprovService,SysdtapeService } from './../service';
import { Cteyprov, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokcpComponent } from './../msgokcp/msgokcp.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { of } from 'rxjs';

interface Tipo {
  Tipo: string;
  desc: string;
}

interface Mpo {
  id    : string;
  nombre: string;
}

@Component({
  selector: 'app-editcteyprov',
  templateUrl: './editcteyprov.component.html',
  styleUrls: ['./editcteyprov.component.css']
})
export class EditcteyprovComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1 = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  progUserc ='ALTAPROD';
  tipCteparam: boolean=false;
  material: boolean=false;
  usuario: string;
  empresaa: string;
  recintoo: string;
  apl: Sysdtape;
  recintos: any[];
  editcteyprov: FormGroup;
  usuari: Login
  loading = false;
  returnUrl: string;
  editsysuserform: FormGroup;
  altausrrol: any =[];
  orders = [];
  clvap: string;
  
  disponibles: any;
  selectedLocations: any = [];
  altauserrol = { appUserId: ' ', roleId: ' ' };
  msg= '';
  datawork: any=[];
  dataworkedit: any=[];
  currentCteyprov: Cteyprov;
  
  recinto				: string;
  empresa				: string;
  nomDenov			: string;
  idCliProv			: string;
  rfc					: string;
  immexCveRec		    : number;
  nomContacto		    : string;
  nal					: string;
  idTax				: string;
  pais				: string;
  colonia				: string;
  curp				: string;
  estado				: string;
  numExt				: string;
  numInte				: string;
  cp					: string;
  calle				: string;
  localidad			: string;
  municipio			: string;
  email				: string;
  userMod				: string;
  tel					: number;
  tipo				: string;
  indAct				: string;
  fechaMod			: string;
  hora				: string;
  fechaAlta			: string; 
  datacp: any=[];

  cveedo: Mpo []=[];
  cvempo: Mpo []=[];
  cveloc: Mpo []=[];
  cvecol: Mpo []=[];
  
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
    this.consultaDatosCteyprov(); 
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
                this.apl = this.datawork.contenido;
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
    this.editcteyprov = this.fb.group({
      'tipCte':       new FormControl(''),
//      'listaTipCte':  new FormControl(''),listaallrto
      'listaallrto':  new FormControl('',[Validators.required]),
      'idCliProv':    new FormControl('',[Validators.required]),
      'nomDenov':     new FormControl('',[Validators.required]),
      'gender':       new FormControl('',[Validators.required]),
//      'orders':       new FormControl('',[Validators.required]),
      'nomContacto':  new FormControl('',[Validators.required]),
      'immexCveRec':  new FormControl('',[Validators.required]),
      'rfc':          new FormControl('',[Validators.required]),
      'idTax':        new FormControl('',[Validators.required]),
      'curp':         new FormControl('',[Validators.required]),
      'listaallapl':  new FormControl('',[Validators.required]),
      'cp':           new FormControl('',[Validators.required]),
      'listaalledo':  new FormControl('',[Validators.required]),
      'listaallmun':  new FormControl('',[Validators.required]),
      'listaallloc':  new FormControl('',[Validators.required]),
//      'listaallcol':  new FormControl('',[Validators.required]),          
      'calle':        new FormControl('',[Validators.required]),          
      'numExt':       new FormControl('',[Validators.required]),          
      'numInte':      new FormControl('',[Validators.required]),          
      'email':        new FormControl('',[Validators.required]),          
      'tel':          new FormControl('',[Validators.required])      
    }); 
  } // Cierre del método formafb
  
//this.sysdtapeService.apeconscveidid(params['clvap'],params['id1'],params['id2'])

  consultaDatosCteyprov(){
    this.activatedRoutee.params.subscribe( params =>{ 
        this.cteyprovService.cteyprovUnico(params['opc'],params['idCliProv'])  
        .pipe(first())
        .subscribe( 
            data => {
                this.datawork = data;
                if (this.datawork.cr=="00"){
                    this.currentCteyprov = this.datawork.contenido;
                    console.log("consultaDatosCteyprov Unico currentCteyprov")
                    console.log(this.currentCteyprov)
                    this.editcteyprov.controls['tipCte'			].setValue(this.currentCteyprov.tipo				      );
//                    this.editcteyprov.controls['listaTipCte'].setValue(this.currentCteyprov.tipo          	);
                    this.editcteyprov.controls['listaallrto'].setValue(this.currentCteyprov.recinto.trim()          );
                    this.editcteyprov.controls['idCliProv'	].setValue(this.currentCteyprov.idCliProv		      );
                    this.editcteyprov.controls['nomDenov'		].setValue(this.currentCteyprov.nomDenov.trim()   );
//                    this.editcteyprov.controls['orders'			].setValue(this.currentCteyprov.nal					    );
                    this.editcteyprov.controls['nomContacto'].setValue(this.currentCteyprov.nomContacto.trim());
                    this.editcteyprov.controls['immexCveRec'].setValue(this.currentCteyprov.immexCveRec	      );
                    this.editcteyprov.controls['rfc'				].setValue(this.currentCteyprov.rfc	      				);
                    this.editcteyprov.controls['idTax'			].setValue(this.currentCteyprov.idTax			      	);
                    this.editcteyprov.controls['curp'				].setValue(this.currentCteyprov.curp      				);
                    this.editcteyprov.controls['listaallapl'].setValue(this.currentCteyprov.país			      	);
                    this.editcteyprov.controls['cp'					].setValue(this.currentCteyprov.cp	      				);
                    this.editcteyprov.controls['listaalledo'].setValue(this.currentCteyprov.estado          	);
                    this.editcteyprov.controls['listaallmun'].setValue(this.currentCteyprov.municipio      		);
                    this.editcteyprov.controls['listaallloc'].setValue(this.currentCteyprov.localidad      		);
//                    this.editcteyprov.controls['listaallcol'].setValue(this.currentCteyprov.colonia	      	);
                    this.editcteyprov.controls['calle'			].setValue(this.currentCteyprov.calle.trim()      );
                    this.editcteyprov.controls['numExt'			].setValue(this.currentCteyprov.numExt      			);
                    this.editcteyprov.controls['numInte'		].setValue(this.currentCteyprov.numInte	      		);
                    this.editcteyprov.controls['email'			].setValue(this.currentCteyprov.email.trim()      );
                    this.editcteyprov.controls['tel'				].setValue(this.currentCteyprov.tel				      	);

                    this.recinto			= this.currentCteyprov.recinto.trim()		  ;      
                    this.empresa			= this.currentCteyprov.empresa		  ;      
                    this.nomDenov		  = this.currentCteyprov.nomDenov     ;        
                    this.idCliProv		= this.currentCteyprov.idCliProv	  ;      
                    this.rfc					= this.currentCteyprov.rfc				  ;      
                    this.immexCveRec	= this.currentCteyprov.immexCveRec  ;       
                    this.nomContacto	= this.currentCteyprov.nomContacto  ;       
                    this.nal					= this.currentCteyprov.nal				  ;      
                    this.idTax				= this.currentCteyprov.idTax			  ;      
                    this.pais				  = this.currentCteyprov.país			  	;        
                    this.colonia			= this.currentCteyprov.colonia		  ;      
                    this.curp				  = this.currentCteyprov.curp	  			;        
                    this.estado			  = this.currentCteyprov.estado       ;  
                    this.numExt			  = this.currentCteyprov.numExt		  	;        
                    this.numInte			= this.currentCteyprov.numInte		  ;      
                    this.cp					  = this.currentCteyprov.cp			  		;        
                    this.calle				= this.currentCteyprov.calle			  ;      
                    this.localidad		= this.currentCteyprov.localidad	  ;      
                    this.municipio		= this.currentCteyprov.municipio	  ;      
                    this.email				= this.currentCteyprov.email			  ;      
                    this.userMod			= this.currentCteyprov.userMod		  ;      
                    this.tel					= this.currentCteyprov.tel				  ;      
                    this.tipo				  = this.currentCteyprov.tipo	  			;        
                    this.indAct			  = this.currentCteyprov.indAct	  		;        
                    this.fechaMod		  = this.currentCteyprov.fechaMod	  	;        
                    this.hora				  = this.currentCteyprov.hora				  ;        
                    this.fechaAlta		= this.currentCteyprov.fechaAlta	        
                    
                    if(this.nal == 'Nacional'){
                      this.editcteyprov.controls['gender'].setValue('N');
                    }else if(this.nal == 'Extranjero'){
                      this.editcteyprov.controls['gender'].setValue('E');
                    }
                    for (let i=0; i < this.cteyprod.length; i++){ 
                      if (this.cteyprod[i].Tipo == this.tipo){
                        this.editcteyprov.controls['tipCte'].setValue(this.cteyprod[i].desc);
                      }
                    }                   
                    this.obtenEdo(this.cp);
//                    console.log("this.currentCteyprov.estado"+ this.currentCteyprov.estado)
 //                   console.log("this.estado" + this.estado)
 //                   console.log("mpo " + this.municipio)
  //                  console.log(this.datacp); 
//                      this.obtenMpo(this.estado.trim())
                }else{
                    this.loading = false;
                    this.msg     = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                }
            },
            error => {
                this.alertService.error("Error al momento de editar el usuario");
                this.loading = false;
            });   
        })
  }     // Cierre del método consultaSysUser
     
  // convenience getter for easy access to form fields
    get f() { return this.editcteyprov.controls; }

  cambio(tp: any){
    if (tp.target.value == '7'){
        this.material = true;
    }else{
       this.material = false;
       this.editcteyprov.controls['tip_Mat'].setValue("");
    }
  }
  obtenEdop(cp: any){
    this.obtenEdo(cp.target.value)
  }

  obtenEdo(cp: any){
      this.cveedo = [];
      this.cvempo = [];
      this.cvecol = [];
      this.cveloc = [];
     console.log("editcteyprov.component.ts obtencp cp") 
     console.log(cp)
//     console.log(cp.target.value)
     this.cteyprovService.obtenCP(cp)
     .pipe(first())
     .subscribe(
         data => {
          if (data.cr=="00"){         
              this.datacp = data.contenido    
              console.log("editcteyprov.component.ts obtenCP");            
              console.log(this.datacp);      
              for (let i=0; i < this.datacp.length; i++){ 
                   if (i>0){
                     console.log(this.datacp[i-1].cEstado)
                     console.log(this.datacp[i].cEstado)
                     if (this.datacp[i-1].cEstado != this.datacp[i].cEstado){
                         console.log("entre a diferentes Edo")
                         this.cveedo.push({id:this.datacp[i].cEstado,nombre:this.datacp[i].dEstado});
                     }
                   }else{
                    console.log("entre a iguales Edo")
                    this.cveedo.push({id:this.datacp[i].cEstado,nombre:this.datacp[i].dEstado});
                    if (this.datacp[i].cEstado == this.estado ){
                      console.log(" SI SON IGUALES")
                    }
                   }
              }
              console.log(this.cveedo)
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
      console.log(listedoid.target.value)
      this.obtenMpo(listedoid.target.value)  
  }

  obtenMpo(listedoid: any){
      this.cvempo = [];
      for (let i=0; i < this.datacp.length; i++) { 
        if (this.datacp[i].cEstado == listedoid){
          if (i>0){
            if (this.datacp[i-1].cMnpio != this.datacp[i].cMnpio){
                this.cvempo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
            }
          }else{
           this.cvempo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
          }
        }
        this.obtenCol(this.municipio.trim())
      }
  }
  
  obtenColp(listmpoid: any){
    console.log(listmpoid.target.value)
    this.obtenMpo(listmpoid.target.value)  
  }

  obtenCol(listmpoid: any){
    this.cvecol = [];
    console.log("obtenCol")
    console.log(listmpoid)
    for (let i=0; i < this.datacp.length; i++) { 
      if (this.datacp[i].cMnpio == listmpoid){
        if (i>0){
          console.log(this.datacp[i-1].idAsentaCpcons)
          console.log(this.datacp[i].idAsentaCpcons)
          if (this.datacp[i-1].idAsentaCpcons != this.datacp[i].idAsentaCpcons){
              console.log("entre a diferentes col")
              this.cvecol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
          }
        }else{
         console.log("entre a iguales col")
         this.cvecol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
        }
      }
    }
  }    

  enviar() {
    console.log("editsysuser enviar currentProdymat")
/*    
    if (this.editsysuserform.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
    */
        this.armausuario();
        console.log(this.currentCteyprov)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewsysuser';
        this.cteyprovService.editcteyprov(this.currentCteyprov)
          .pipe(first())
          .subscribe(
              data => {
                this.dataworkedit = data;
                if (this.dataworkedit.cr=="00"){
                    this.msgokcp();                    
                }
              },
              error => {
                this.alertService.error("Error al enviar el usuario");
                this.loading = false;
              });    
    } //     Cierre del metodo enviar
  
    armausuario(){

      this.currentCteyprov = {

        nomDenov			: this.f.nomDenov.value,        
        idCliProv			: this.f.idCliProv.value,     
        rfc						: this.f.rfc.value,           
        immexCveRec		: this.f.immexCveRec.value,   
        nomContacto		: this.f.nomContacto.value,   
        nal           : this.f.gender.value, 
        idTax					: this.f.idTax.value,         
        país					: this.f.listaallapl.value,     
        colonia				: '',   
        curp					: this.f.curp.value,            
        estado				: this.f.listaalledo.value,     
        numExt				: this.f.numExt.value,          
        numInte				: this.f.numInte.value,       
        cp						: this.f.cp.value,              
        calle					: this.f.calle.value,         
        localidad			: this.f.listaallloc.value,   
        municipio			: this.f.listaallmun.value,   
        email					: this.f.email.value,         
        tel						: this.f.tel.value,           
        recinto       : this.f.listaallrto.value,                 

        tipo					: this.tipo,
        indAct        : this.indAct,
        empresa	      : this.empresa,               
//        recinto       : this.recinto,                
        fechaAlta     : this.curr,                   
        fechaMod      : this.curr,                   
        hora          : this.curr1,                  
        userMod       : this.usuario.substring(0, 8)   
      }    
      if (this.currentCteyprov.nal == "N"){
          this.currentCteyprov.nal = "Nacional"
      }else{
          this.currentCteyprov.nal = "Extranjero"
      }         
  }     // Cierre del metodo armausuario
    
  cancelar(clveProduc: string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/cteyprov';
    this.router.navigate([this.returnUrl]);   
  }     // Cierre del metodo cancelar
  
  msgokcp(): void {
    const dialogRef = this.dialog.open(MsgokcpComponent, {
      width: '400px',
      height: '200px',
      data: {idCliProv: this.idCliProv}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }    // Cierre del método msgok
}
