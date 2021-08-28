import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertService, UsersService } from './../service';


@Component({
  selector: 'app-deletesysuser',
  templateUrl: './deletesysuser.component.html',
  styleUrls: ['./deletesysuser.component.css']
})
export class DeletesysuserComponent implements OnInit {
  idUsuario: string = ''; 
  returnUrl: string;
  loading = false;
  msg= '';

  constructor(
    public dialogRef: MatDialogRef<DeletesysuserComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  deletesysusr(idUsuario: string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
    this.idUsuario = idUsuario;
    this.usersService.deletesysusrid(idUsuario)
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr="00"){
            this.router.navigate([this.returnUrl]);  
            this.onNoClick();
          }else{
            this.loading = false;
            this.msg = this.data.descripcion;
            this.alertService.error(this.msg);
          }
        },
        error => {
          this.alertService.error("Error en el borrado del usuario");
          this.loading = false;
        });    
    }
 

  onNoClick(): void {
    this.dialogRef.close();
  }

}
