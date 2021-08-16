import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './components/alert.component';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteusrComponent } from './deleteusr/deleteusr.component';
import { MaterialModule } from "./material.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChangepswComponent } from './changepsw/changepsw.component';
import { EdituserComponent } from './edituser/edituser.component';
import { AltauserComponent } from './altauser/altauser.component';
import { RolComponent } from './rol/rol.component';
import { AltarolComponent } from './altarol/altarol.component';
import { ViewrolComponent } from './viewrol/viewrol.component';
import { GroupByPipe } from './group-by.pipe';
import { DisablerolComponent } from './disablerol/disablerol.component';
import { EnablerolComponent } from './enablerol/enablerol.component';
import { DeleterolComponent } from './deleterol/deleterol.component';
import { PaginacionComponent } from './paginacion/paginacion.component';
import { JwtInterceptor } from '../app/helpers/jwt.interceptor'


@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    ViewuserComponent,
    DeleteusrComponent,
    ChangepswComponent,
    EdituserComponent,
    AltauserComponent,
    RolComponent,
    AltarolComponent,
    ViewrolComponent,
    GroupByPipe,
    DisablerolComponent,
    EnablerolComponent,
    DeleterolComponent,
    PaginacionComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    NgSelectModule,
    FormsModule
  ],
  exports: [
    MaterialModule
  ],

  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }



