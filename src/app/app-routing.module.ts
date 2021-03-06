import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './helpers/auth.guard';
import { LoginComponent } from './login';

import { DashboardComponent } from './dashboard/dashboard.component';

import { UsersComponent } from './users/users.component';
import { AltasysuserComponent } from './altasysuser/altasysuser.component';
import { ViewsysuserComponent } from './viewsysuser/viewsysuser.component';
import { EditsysuserComponent } from './editsysuser/editsysuser.component';

import { ProdymatComponent } from './prodymat/prodymat.component';
import { AltaproymatComponent } from './altaproymat/altaproymat.component';
import { ViewprodymatComponent } from './viewprodymat/viewprodymat.component';
import { EditprodymatComponent } from './editprodymat/editprodymat.component';

import { CteyprovComponent } from './cteyprov/cteyprov.component';
import { ViewcteyprovComponent } from './viewcteyprov/viewcteyprov.component';
import { AltacteyprovComponent } from './altacteyprov/altacteyprov.component';
import { EditcteyprovComponent } from './editcteyprov/editcteyprov.component';

import { PartesComponent } from './partes/partes.component';
import { ViewpartesComponent } from './viewpartes/viewpartes.component';
import { AltaparteComponent } from './altaparte/altaparte.component';
import { EditparteComponent } from './editparte/editparte.component';

import { FacturasComponent } from './facturas/facturas.component';
import { ViewfacturasComponent } from './viewfacturas/viewfacturas.component';
import { AltafacturasComponent } from './altafacturas/altafacturas.component';
import { EditfacturasComponent } from './editfacturas/editfacturas.component';

import { PartessalComponent } from './partessal/partessal.component';
import { ViewpartesalComponent } from './viewpartesal/viewpartesal.component';

import { FacturasalComponent } from './facturasal/facturasal.component';
import { ViewfacturasalComponent } from './viewfacturasal/viewfacturasal.component';
import { AltafacturasalComponent } from './altafacturasal/altafacturasal.component';
import { EditfacturasalComponent } from './editfacturasal/editfacturasal.component';

import { TraspasosComponent } from './traspasos/traspasos.component';
import { ViewtraspasosComponent } from './viewtraspasos/viewtraspasos.component';
import { AltatraspasosComponent } from './altatraspasos/altatraspasos.component';
import { EdittraspasosComponent } from './edittraspasos/edittraspasos.component';

import { AduanalComponent } from './aduanal/aduanal.component';
import { ViewaduanalComponent } from './viewaduanal/viewaduanal.component';
import { AltaaduanalComponent } from './altaaduanal/altaaduanal.component';
import { EditaduanalComponent } from './editaduanal/editaduanal.component';

import { UsuarioComponent } from './usuario/usuario.component';
import { AltauserComponent } from './altauser/altauser.component';
import { EdituserComponent } from './edituser/edituser.component';
import { ViewuserComponent } from './viewuser/viewuser.component';
import { DeleteusrComponent } from './deleteusr/deleteusr.component';
import { RolComponent } from './rol/rol.component';
import { AltarolComponent } from './altarol/altarol.component';
import { ViewrolComponent } from './viewrol/viewrol.component';
import { ApeComponent } from './ape/ape.component';
import { ViewapeComponent } from './viewape/viewape.component';
import { EditapeComponent } from './editape/editape.component';
import { AltaapeComponent } from './altaape/altaape.component';


const routes: Routes = [
//  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
//  { path: '', redirectTo: "/login",pathMatch:"full"},
  
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
//  { path: 'home', component: HomeComponent, canActivate:[AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard] },
//  { path: 'dashboard', component: DashboardComponent },
  
  { path: 'users', component: UsersComponent },
  { path: 'altasysuser', component: AltasysuserComponent },
  { path: 'viewsysuser/:idUsuario', component: ViewsysuserComponent },
  { path: 'editsysuser/:idUsuario', component: EditsysuserComponent },

  { path: 'prodymat', component: ProdymatComponent },
  { path: 'altaprodymat/:Tipo', component: AltaproymatComponent },
  { path: 'viewprodymat/:clveProduc', component: ViewprodymatComponent },
  { path: 'editprodymat/:clveProduc', component: EditprodymatComponent },

  { path: 'cteyprov', component: CteyprovComponent },
  { path: 'viewcteyprov', component: ViewcteyprovComponent },
  { path: 'altactesyprov/:Tipo', component: AltacteyprovComponent },
  { path: 'editcteyprov', component: EditcteyprovComponent },
  
  { path: 'partes', component: PartesComponent },
  { path: 'viewpartes', component: ViewpartesComponent },
  { path: 'altaparte/:Tipo', component: AltaparteComponent },
  { path: 'editpartes', component: EditparteComponent },
  
  { path: 'facturas', component: FacturasComponent },
  { path: 'viewfacturas', component: ViewfacturasComponent },
  { path: 'altafactura/:cliente', component: AltafacturasComponent },
  { path: 'editfacturas', component: EditfacturasComponent },
    
  { path: 'partesal', component: PartessalComponent },
  { path: 'viewpartesal', component: ViewpartesalComponent },

  { path: 'facturasal', component: FacturasalComponent },
  { path: 'viewfacturasal', component: ViewfacturasalComponent },
  { path: 'altafacturasal/:cliente', component: AltafacturasalComponent },
  { path: 'editfacturasal', component: EditfacturasalComponent },

  { path: 'traspasos', component: TraspasosComponent },
  { path: 'viewtraspasos', component: ViewtraspasosComponent },
  { path: 'altatraspasos/:cliente', component: AltatraspasosComponent },
  { path: 'edittraspasos', component: EdittraspasosComponent },


  { path: 'aduanal', component: AduanalComponent },
  { path: 'viewaduanal/:numPat', component: ViewaduanalComponent },
  { path: 'altaaduanal/:numPat', component: AltaaduanalComponent },
  { path: 'editaduanal/:numPat', component: EditaduanalComponent },

  { path: 'usuarios', component: UsuarioComponent },
  { path: 'altauser', component: AltauserComponent },
  { path: 'edituser/:username', component: EdituserComponent },
  { path: 'viewuser/:username', component: ViewuserComponent },
  { path: 'deleteusr/:username', component: DeleteusrComponent },
  { path: 'rol', component: RolComponent },
  { path: 'altarol', component: AltarolComponent },  
  { path: 'viewrol/:id', component: ViewrolComponent },
//  { path: 'ape/:clvap', component: ApeComponent },
  { path: 'ape', component: ApeComponent },
  { path: 'consultaDatosApe', component: ViewapeComponent },
  { path: 'editape', component: EditapeComponent },
  { path: 'altaape', component: AltaapeComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
//    onSameUrlNavigation: 'reload'    ],
  exports: [RouterModule]


  



})
export class AppRoutingModule { }

//export const appRoutingModule = RouterModule.forRoot(routes);