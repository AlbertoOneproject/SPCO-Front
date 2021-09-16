import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Login, Catcte, Cteyprov } from './../model'
import { CteyprovService } from './../service';
import { first } from 'rxjs/operators';
import { AlertService } from './../service';
import { Router, ActivatedRoute } from '@angular/router';

interface Tipo {
  Tipo: string;
  desc: string;
}
@Component({
  selector: 'app-cteyprov',
  templateUrl: './cteyprov.component.html',
  styleUrls: ['./cteyprov.component.css']
})
export class CteyprovComponent implements OnInit {
  login: Login;
  ctesyprovForm: FormGroup;
  detalle: boolean;
  perfil:boolean;
  ctecat: Catcte;
  loading = false;
  page: number;
  perPage: number;
  perName: string;
  total: number;
  totalPages: number;
  msg= '';
  tipocte: string = "0";
  opc:string="1";
  returnUrl: string;
  currentCteyprov: CteyprovService;
  currentuMDescripcion: any[];
  cteyprod: Tipo[] = [
    {Tipo: '1', desc: 'Contribuyente'},
    {Tipo: '2', desc: 'Cliente'},
    {Tipo: '3', desc: 'Destinatario'},
    {Tipo: '4', desc: 'Proveedor'},
    {Tipo: '5', desc: 'Transportista'}
  ];

  
  constructor(
    private formBuilder: FormBuilder,
    private cteyprovService: CteyprovService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.page = 1;
    this.perPage = 6;
    this.perName = "";
   }

  ngOnInit(): void {
    //this.catCteProv();
    this.ctesyprovForm = this.formBuilder.group({
      'listaprod':new FormControl('', [Validators.required]),
    });

    this.login = JSON.parse(localStorage.getItem('currentUserLog'));
    let perfillogin = this.login["idPerfil"];
    if (perfillogin=="US01"){
        this.perfil=true;      
    }else{
        this.perfil=false;
    }
    console.log("creyprov.component.ts")
    console.log(this.perfil)

    this.detalle=false;      
  }
    // convenience getter for easy access to form fields
    get f() { return this.ctesyprovForm.controls; }

    catCteProv(){
    this.cteyprovService.catCteyProv()
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.ctecat = data.contenido;
        }},
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Clientes y Proveedores");              
          this.loading = false;
        });
    } // Cierre del método catCteProv
    
    consultaCteyprov(tipocte:string, page: number, perPage: number, perName: string)  {    
      console.log("cteyprov.component.ts consultaCteyprov tipocte")
      console.log(tipocte);
    this.tipocte = tipocte;
    this.cteyprovService.Cteyprovid(tipocte, page, perPage, perName)
    .pipe(first())
    .subscribe(
      data => {
          if (data.cr=="00"){
              this.detalle=true;       
              this.page = data.contenido.page;
              this.perPage = data.contenido.perPage;
              this.total = data.contenido.total;
              this.totalPages = data.contenido.totalPages;
              this.currentCteyprov = data.contenido.sysCatClientes;
/*              
              this.currentuMDescripcion = data.uMDescripcion;
              for (let i=0; i < this.currentuMDescripcion.length; i++){ 
                  this.currentCteyprov[i].uM = this.currentuMDescripcion[i]
              }
*/              
          }else{
              this.loading = false;
              this.msg = data.descripcion;
              this.alertService.error(this.msg);
        }
      },
        error => {
            this.alertService.error("No hay conexión con la Base de Datos");
            this.loading = false;
        });
  }  // Cierre del método consultaProdymat

  routeTo(idCliProv:string): void {
    console.log("cteyprov.component.ts routeTo idCliProv")
    console.log(this.opc,idCliProv)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewcteyprov';
    this.router.navigate([this.returnUrl,{opc:this.opc,idCliProv:idCliProv}]);   
  }  
  
  mudouPagina(evento) {
    this.perName = ""
    this.consultaCteyprov(this.tipocte, evento.valor, this.perPage, this.perName); 
  }

}
