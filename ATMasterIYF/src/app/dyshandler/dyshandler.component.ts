import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import swal from 'sweetalert2';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-dyshandler',
  templateUrl: './dyshandler.component.html',
  styleUrls: ['./dyshandler.component.css'],
  providers: [UserService],

})
export class DyshandlerComponent implements OnInit {

  dystopic = '';

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private router: Router,
    public dialogRef: MatDialogRef<DyshandlerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  handleDysTopic(form: NgForm): void {
    this.dialogRef.close(form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
