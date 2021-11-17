import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Loginreceive} from './../model'
import { AlertService, LoginService } from './../service';


@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error='';
  msg= '';

//  currentUser: Login;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private alertService: AlertService

    ) { 
    // redirect to home if already logged in
    if (this.loginService.currentUserValue) { 
        this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
        usuario:  ['', Validators.required],
        password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

// convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.loginService.login(this.f.usuario.value, this.f.password.value)
        .pipe(first())
        .subscribe(
            data => {
              if (data.cr=="00"){
                 if(data.authenticated){
                    this.router.navigate([this.returnUrl]);
                 }else{
                  this.loading = false;
                  this.alertService.error("Usuario no autenticado");
                 }
              }else{
                this.loading = false;
                this.msg = data.descripcion;
                this.alertService.error(this.msg);
              }
            },            
            error => {
                this.alertService.error("Error en el proceso de Login");
                this.loading = false;
            });
  }      // Cierre del método onSubmit
}        // Cierre del método Principal