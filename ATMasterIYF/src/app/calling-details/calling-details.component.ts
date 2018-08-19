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
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-calling-details',
  templateUrl: './calling-details.component.html',
  styleUrls: ['./calling-details.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class CallingDetailsComponent implements OnInit, AfterViewInit {

  todayDate = new Date();
  checked = false;
  comment = '';
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private _dataService: DataService,
    private router: Router,
    public snackBar: MatSnackBar) { }

  displayedColumns = ['name', 'contact', 'counsellor', 'course', 'actions'];

  ELEMENT_DATA: Element[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

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

  checkIfDevoteePresntForGivenDate(date, myArray) {
    for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].date === date) {
            console.log('yes');
            return myArray[i];
        }
    }
  }

  findActive () {
    const classList = [];

    this._userService.getSdlClassesCourse('OTP')
    .subscribe(sdlClass => {
           console.log('in active ', this.dataSource.data[0], sdlClass);
            this.dataSource.data.forEach(element => {
              if (element['attendance'] && element['attendance'].length > 0) {
                for (let j = 0; j < 8; j++) {
                  let status = {};
                 // console.log('class  is ', sdlClass.result[j].date, element['attendance']);
                  status = this.checkIfDevoteePresntForGivenDate(sdlClass.result[j].date, element['attendance']);
                  // console.log('status is ', status);
                  if ( status  !== undefined) {
                    //  console.log('status', element['contact'], element['name']);
                      classList.push(element);
                  }
                }
              }
          });
        console.log('class list is ', classList);
        this.dataSource.data =  classList;
    });

  }

  changeBox(e, type) {
    console.log(e.checked, type === 'Active');
    if (e.checked === false) {
       this.dataSource.filter = '';
    } else {
      type = type.trim(); // Remove whitespace
      type = type.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      if (type === 'active') {
        console.log(type);
        this.findActive();
      } else {
        this.dataSource.filter = type;
      }
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }




}
