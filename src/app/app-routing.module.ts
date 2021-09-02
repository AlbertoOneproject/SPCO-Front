import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './helpers/auth.guard';
import { LoginComponent } from './login';
import { UsersComponent } from './users/users.component';
import { AltasysuserComponent } from './altasysuser/altasysuser.component';
import { ViewsysuserComponent } from './viewsysuser/viewsysuser.component';
import { EditsysuserComponent } from './editsysuser/editsysuser.component';
import { ProdymatComponent } from './prodymat/prodymat.component';
import { AltaproymatComponent } from './altaproymat/altaproymat.component';
import { ViewprodymatComponent } from './viewprodymat/viewprodymat.component';
import { EditprodymatComponent } from './editprodymat/editprodymat.component';

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
  { path: 'home', component: HomeComponent, canActivate:[AuthGuard] },
  { path: 'users', component: UsersComponent },
  { path: 'altasysuser', component: AltasysuserComponent },
  { path: 'viewsysuser/:idUsuario', component: ViewsysuserComponent },
  { path: 'editsysuser/:idUsuario', component: EditsysuserComponent },
  { path: 'prodymat', component: ProdymatComponent },
  { path: 'altaprodymat', component: AltaproymatComponent },
  { path: 'viewprodymat/:clveProduc', component: ViewprodymatComponent },
  { path: 'editprodymat/:clveProduc', component: EditprodymatComponent },

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