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
import { JwtInterceptor } from '../app/helpers/jwt.interceptor';
import { ViewapeComponent } from './viewape/viewape.component';
import { ApeComponent } from './ape/ape.component';
import { DeleteapeComponent } from './deleteape/deleteape.component';
import { EditapeComponent } from './editape/editape.component';
import { AltaapeComponent } from './altaape/altaape.component';
import { UsersComponent } from './users/users.component';
import { AltasysuserComponent } from './altasysuser/altasysuser.component';
import { ViewsysuserComponent } from './viewsysuser/viewsysuser.component';
import { EditsysuserComponent } from './editsysuser/editsysuser.component';
import { DeletesysuserComponent } from './deletesysuser/deletesysuser.component';
import { ChangesyspswComponent } from './changesyspsw/changesyspsw.component';
import { MsgokComponent } from './msgok/msgok.component';
import { ProdymatComponent } from './prodymat/prodymat.component';
import { AltaproymatComponent } from './altaproymat/altaproymat.component';
import { ViewprodymatComponent } from './viewprodymat/viewprodymat.component';
import { EditprodymatComponent } from './editprodymat/editprodymat.component';
import { DeleteprodymatComponent } from './deleteprodymat/deleteprodymat.component';
import { MsgokpmComponent } from './msgokpm/msgokpm.component';
import { CteyprovComponent } from './cteyprov/cteyprov.component';
import { ViewcteyprovComponent } from './viewcteyprov/viewcteyprov.component';
import { AltacteyprovComponent } from './altacteyprov/altacteyprov.component';
import { EditcteyprovComponent } from './editcteyprov/editcteyprov.component';
import { MsgokcpComponent } from './msgokcp/msgokcp.component';
import { PartesComponent } from './partes/partes.component';
import { ViewpartesComponent } from './viewpartes/viewpartes.component';
import { AltaparteComponent } from './altaparte/altaparte.component';
import { MsgokpComponent } from './msgokp/msgokp.component';
import { DeleteparteComponent } from './deleteparte/deleteparte.component';
import { EditparteComponent } from './editparte/editparte.component';
import { FacturasComponent } from './facturas/facturas.component';
import { ViewfacturasComponent } from './viewfacturas/viewfacturas.component';
import { AltafacturasComponent } from './altafacturas/altafacturas.component';
import { MsgokfComponent } from './msgokf/msgokf.component';
import { DeletefacturaComponent } from './deletefactura/deletefactura.component';
import { AduanalComponent } from './aduanal/aduanal.component';
import { ViewaduanalComponent } from './viewaduanal/viewaduanal.component';
import { DeleteaduanalComponent } from './deleteaduanal/deleteaduanal.component';
import { AltaaduanalComponent } from './altaaduanal/altaaduanal.component';
import { EditaduanalComponent } from './editaduanal/editaduanal.component';
import { MsgokaduanalComponent } from './msgokaduanal/msgokaduanal.component';
import { EditfacturasComponent } from './editfacturas/editfacturas.component';
import { PartessalComponent } from './partessal/partessal.component';
import { ViewpartesalComponent } from './viewpartesal/viewpartesal.component';
import { AltafacturasalComponent } from './altafacturasal/altafacturasal.component';
import { EditfacturasalComponent } from './editfacturasal/editfacturasal.component';
import { FacturasalComponent } from './facturasal/facturasal.component';
import { ViewfacturasalComponent } from './viewfacturasal/viewfacturasal.component'


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
    PaginacionComponent,
    ViewapeComponent,
    ApeComponent,
    DeleteapeComponent,
    EditapeComponent,
    AltaapeComponent,
    UsersComponent,
    AltasysuserComponent,
    ViewsysuserComponent,
    EditsysuserComponent,
    DeletesysuserComponent,
    ChangesyspswComponent,
    MsgokComponent,
    ProdymatComponent,
    AltaproymatComponent,
    ViewprodymatComponent,
    EditprodymatComponent,
    DeleteprodymatComponent,
    MsgokpmComponent,
    CteyprovComponent,
    ViewcteyprovComponent,
    AltacteyprovComponent,
    EditcteyprovComponent,
    MsgokcpComponent,
    PartesComponent,
    ViewpartesComponent,
    AltaparteComponent,
    MsgokpComponent,
    DeleteparteComponent,
    EditparteComponent,
    FacturasComponent,
    ViewfacturasComponent,
    AltafacturasComponent,
    MsgokfComponent,
    DeletefacturaComponent,
    AduanalComponent,
    ViewaduanalComponent,
    DeleteaduanalComponent,
    AltaaduanalComponent,
    EditaduanalComponent,
    MsgokaduanalComponent,
    EditfacturasComponent,
    PartessalComponent,
    ViewpartesalComponent,
    AltafacturasalComponent,
    EditfacturasalComponent,
    FacturasalComponent,
    ViewfacturasalComponent
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



