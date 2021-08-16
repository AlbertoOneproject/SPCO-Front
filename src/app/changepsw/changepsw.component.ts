import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UsuarioService } from './../service';


export const validarQueSeanIguales: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const password = control.get("password")
  const repeatPassword = control.get("repeatPassword")

  return password.value === repeatPassword.value
    ? null
    : { noSonIguales: true }
}

@Component({
  selector: 'app-changepsw',
  templateUrl: './changepsw.component.html'
})
export class ChangepswComponent implements OnInit {
  passForm: FormGroup;
  returnUrl: string;
  loading = false;
  alertSolicitante: boolean = false;
  classAlert: string;
  msg= '';


  constructor(
    public dialogRef: MatDialogRef<ChangepswComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService

  ) { }

  ngOnInit() {
    this.passForm = this.fb.group({
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
  });
  }
  // convenience getter for easy access to form fields
get f() { return this.passForm.controls; }
  
  changepsw(): void {
    this.loading = true;

    if (this.f.password.value === this.f.repeatPassword.value) {
    
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/usuarios';
        
        this.usuarioService.changepsw(this.data.username, this.f.password.value )
        .pipe(first())
        .subscribe(
            data => {
              if (data.cr="00"){
                this.router.navigate([this.returnUrl]);
                this.onNoClick();
                this.alertSolicitante = true;        
//                this.loading = false;
//                this.msg = data.mensaje;
//                this.classAlert = 'alert alert-success';       
              }
              else{
                this.loading = false;
                this.msg = this.data.descripcion;
                this.alertService.error(this.msg);
              }
            },
              error => {
                  this.alertSolicitante = true;  
                  this.loading = false;
                  this.msg = error;
                  this.classAlert = 'alert alert-danger';
          
              });    
             
        }
    else {
      this.alertSolicitante = true;   
      this.loading = false;
      this.msg = "Las contrseñas no Coinciden";
      this.classAlert = 'alert alert-danger';

       return   
    }
  }      

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeAlertInm(){
    this.alertSolicitante = false;
  }
}
