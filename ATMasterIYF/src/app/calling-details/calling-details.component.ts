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
import { DataService } from '../data.service';


@Component({
  selector: 'app-calling-details',
  templateUrl: './calling-details.component.html',
  styleUrls: ['./calling-details.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class CallingDetailsComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private _dataService: DataService,
    private router: Router,
    public snackBar: MatSnackBar) { }

  displayedColumns = ['name', 'contact', 'counsellor', 'course', 'actions'];

  ELEMENT_DATA: Element[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  todayDate = new Date();
  comment = '';
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    /* this._dataService.currentMessage.subscribe(message => {
       console.log('mesage ', message);
       this.dataSource.data = message;
     });*/
    this.route.params.subscribe(params => {
      this._userService.getCounsellorData(params['username'])
      .subscribe(data => {
         console.log('data is ', data);
         this.dataSource.data = data.resources;

      });
    });
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
