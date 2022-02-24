import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-msgokt',
  templateUrl: './msgokt.component.html',
  styleUrls: ['./msgokt.component.css']
})
export class MsgoktComponent implements OnInit {
  returnUrl: string;
  loading = false;
  msg= '';

  constructor(
    public dialogRef: MatDialogRef<MsgoktComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  confirmar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/traspasos';
    this.router.navigate([this.returnUrl]);  
    this.onNoClick();
  }
 
  onNoClick(): void {
    this.dialogRef.close();
  }

}
