import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, throwMatDialogContentAlreadyAttachedError} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {ViewEncapsulation} from '@angular/core';
import { ShowdetailsComponent } from '../showdetails/showdetails.component';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-counselor-details',
  templateUrl: './counselor-details.component.html',
  styleUrls: ['./counselor-details.component.css'],
  providers: [UserService]

})
export class CounselorDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorDetails: MatPaginator;


  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private router: Router,
    public snackBar: MatSnackBar, private appComp: AppComponent) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['coun'] === '1') {
        this._userService.getCounsellorData('sgp')
        .subscribe(data => {
            console.log('data is ', data);
        });
      }
  });
  }

}
