import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-email-popup',
  templateUrl: './confirm-email-popup.component.html',
  styleUrls: ['./confirm-email-popup.component.scss']
})
export class ConfirmEmailPopupComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<ConfirmEmailPopupComponent>) { }

  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }

}
