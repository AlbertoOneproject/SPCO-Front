import { Component, OnInit, Inject } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertService, UsersService } from './../service';

@Component({
  selector: 'app-msgok',
  templateUrl: './msgok.component.html',
  styleUrls: ['./msgok.component.css']
})
export class MsgokComponent {
  idUsuario: string = ''; 
  returnUrl: string;
  loading = false;
  msg= '';

  constructor(
    public dialogRef: MatDialogRef<MsgokComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  confirmar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
    this.router.navigate([this.returnUrl]);  
    this.onNoClick();
  }
 
  onNoClick(): void {
    this.dialogRef.close();
  }

}