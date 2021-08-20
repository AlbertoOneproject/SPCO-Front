import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertService, SysdtapeService } from './../service';
import { first } from 'rxjs/operators';
import { Sysdtape } from './../model';

@Component({
  selector: 'app-altaape',
  templateUrl: './altaape.component.html',
  styleUrls: ['./altaape.component.css']
})

export class AltaapeComponent implements OnInit {
  altaapeform: FormGroup;
  submitted = false;
  currentApe: Sysdtape;
  returnUrl: string;
  datawork: any=[];
  msg= '';

  loading = false;

  constructor(
    private fb: FormBuilder,
    private sysdtapeService: SysdtapeService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,

//    private activatedRoutee: ActivatedRoute,
//    private fb: FormBuilder,
//    private usuarioService: UsuarioService, 
//    private rolService: RolService, 
//    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.submitted = true;
    this.formafb();
  }

  formafb() {
    this.altaapeform = this.fb.group({
    'clvap': new FormControl('', [Validators.required]),
    'id1': new FormControl('', [Validators.required]),
    'id2': new FormControl('',[Validators.required]),
    'indVis': new FormControl('',[Validators.required]),
    'desCorta': new FormControl('',[Validators.required]),
    'desLarga': new FormControl('',[Validators.required])
}); 
} // Cierre del método formafb

// convenience getter for easy access to form fields
get f() { return this.altaapeform.controls; }

  enviar(){  
/*    
    if (this.altauserform.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
    */
    console.log("editape.component.ts enviar 1")
      this.armaape();
      this.loading = true;
      this.returnUrl = this.route.snapshot.queryParams['returnU rl'] || '/home';
      this.sysdtapeService.altaape(this.currentApe)
          .pipe(first())
          .subscribe(
              data => {
                  this.datawork = data;
                  if (this.datawork.cr=="00"){
                    console.log("altaape.component.ts enviar      datawork y  contenido.id")
                    console.log(this.datawork)
                    console.log(this.datawork.contenido.id)
                    this.router.navigate([this.returnUrl]);
                    this.loading = false;
                  }
                  else{
                    this.loading = false;
                    this.msg = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                  }
                },
              error => {
                this.alertService.error("Error en el Alta de Usuario");
                this.loading = false;
              }); 
                
                 
      return           
  } // Cierre del método enviar

  armaape(){
    this.currentApe = {
        clvap: this.f.clvap.value, 
        id1: this.f.id1.value, 
        id2: this.f.id2.value,
        indVis: this.f.indVis.value,
        desCorta: this.f.desCorta.value,
        desLarga: this.f.desLarga.value 
        }
        console.log("altaape.component.ts/armaape      currentApe")
        console.log(this.currentApe)
  } // Cierre del metodo armausuario
}
