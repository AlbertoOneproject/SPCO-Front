import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertService, RolService } from './../service';
import { Rol } from '../model/rol';

@Component({
  selector: 'app-disablerol',
  templateUrl: './disablerol.component.html',
  styles: [
  ]
})
export class DisablerolComponent implements OnInit {
  regrol: Rol;
  returnUrl: string;
  loading = false;
  msg= '';

  constructor(
    public dialogRef: MatDialogRef<DisablerolComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private rolService: RolService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }
  
  disablerol(updaterol): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/rol';
    this.regrol = updaterol;
    this.regrol.disable = true;
    updaterol = this.regrol
    this.rolService.updaterol(updaterol)
    .pipe(first())
    .subscribe(
        data => {
          if (this.data.cr="00"){
            this.router.navigate([this.returnUrl]);
            this.onNoClick();
          }else{
            this.loading = false;
            this.msg = this.data.descripcion;
            this.alertService.error(this.msg);
          }
        },
          error => {
            this.alertService.error("Error en el momento de deshabilitar el rol");
            this.loading = false;
          });   
           
    }
   
  onNoClick(): void {
    this.dialogRef.close();
  }
}
