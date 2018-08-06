import { Component, OnInit, Inject, ViewChild, AfterViewInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {ViewEncapsulation} from '@angular/core';
import { ShowdetailsComponent } from '../showdetails/showdetails.component';


@Component({
  selector: 'app-calling-details',
  templateUrl: './calling-details.component.html',
  styleUrls: ['./calling-details.component.css']
})
export class CallingDetailsComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private router: Router,
    public snackBar: MatSnackBar) { }

  displayedColumns = ['name', 'contact', 'counsellor', 'course', 'actions'];

  @Input()
  dataSource = new MatTableDataSource([]);

  @Input('isLoggedIn')
  isLoggedIn = false;


  todayDate = new Date();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
     console.log('in calling ', this.isLoggedIn, this.dataSource);
   }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }




}
