import { Component, OnInit, Inject, ViewChild, AfterViewInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {ViewEncapsulation} from '@angular/core';
import { ShowdetailsComponent } from '../showdetails/showdetails.component';
import { DataService } from '../data.service';
import {AppComponent} from '../app.component';
import swal from 'sweetalert2';


@Component({
  selector: 'app-calling-details',
  templateUrl: './calling-details.component.html',
  styleUrls: ['./calling-details.component.css'],

})
export class CallingDetailsComponent implements OnInit, AfterViewInit {

  todayDate = new Date();
  checked = false;
  comment = '';
  selected = 'CA';
  isCourseSelected = false;
  selectedCourse = '';
  selectedBox = false;
  copyDataSource = [];
  originalCopy = [];
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private _dataService: DataService,
    private router: Router, private appComp: AppComponent, 
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
     const getLoggedIn = localStorage.getItem('ctoken');
    console.log('getLogged in ', getLoggedIn);
    if (getLoggedIn) {
        this._userService.iscTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
           console.log('data is ', tokenRes);

            if (tokenRes.result === 'ok') {
              this.route.params.subscribe(params => {
                this._userService.getCounsellorData(params['username'])
                .subscribe(data => {
                   this.dataSource.data = data.resources;
                   this.originalCopy = this.dataSource.data;
                });
              });
              this.appComp.isLoggedIn = true;
              this.appComp.userName =  localStorage.getItem('cname');
            } else {
                this.router.navigateByUrl('/counLogin');
            }
        });
    } else {
      this.router.navigateByUrl('/counLogin');

    }

   }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getDate() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const datenew =  date.getDate() + '-' + month + '-' + date.getFullYear();
    return datenew;
  }

  // [ngClass]="isLocked(element) ? '':'locked'"
  /*isLocked(element) {
      console.log('element ', element.contact);
      if ( element.calling && element.calling.length > 0 ) {
        element.calling.forEach(data => {
          if (data.date === this.getDate()) {
            console.log('data is ', data);
            return true;
          }
        });
      }
  }*/

  lockIt(element, event) {
  //  console.log('element ', element.calling);
    element['locked'] = true;
    this._userService.updateComment(element)
      .subscribe(result => {
          console.log('result is ', result);
          if (result.result === 'ok') {
            swal({

              type: 'success',
              title: 'Hare Krishna, Status locked for the day',
              html: 'Hari Bol!!',
              showConfirmButton: false,
              timer: 1500
          });
          } else {
            swal({

              type: 'success',
              title: 'Hare Krishna, Status already locked for the day',
              html: 'Hari Bol!!',
              showConfirmButton: false,
              timer: 1500
          });

          }
      });
  }

  checkIfDevoteePresntForGivenDate(date, myArray) {
    for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].date === date) {
            return myArray[i];
        }
    }
  }

  findActive () {
    const classList = [];
    console.log('class list is ', this.selectedCourse);
    this.copyDataSource = this.dataSource.data;

    this._userService.getSdlClassesCourse(this.selectedCourse)
    .subscribe(sdlClass => {
           console.log('in active ', this.dataSource.data, sdlClass);
            this.dataSource.data.forEach(element => {
              if (element['attendance'] && element['attendance'].length > 0) {
                for (let j = 0; j < 8; j++) {
                  let status = {};
                 // console.log('class  is ', sdlClass.result[j].date);
                 if (sdlClass.result[j] === undefined) {
                    break;
                 }
                 status = this.checkIfDevoteePresntForGivenDate(sdlClass.result[j].date, element['attendance']);
                  // console.log('status is ', status);
                  if ( status  !== undefined) {
                    //  console.log('status', element['contact'], element['name']);
                      classList.push(element);
                      break;
                  }
                }
              }
          });
        this.dataSource.data =  classList;
    });

  }

  OnSelectCourse(e) {
    console.log('event is ', e, this.selectedBox);
    if (this.selectedBox) {
      this.dataSource.data = this.originalCopy;
      this.dataSource.filter = e;
      this.findActive();
    } else {
      this.isCourseSelected = true;
      this.dataSource.filter = e;

    }

  }

  changeBox(e, type) {
    console.log(e.checked, this.selectedCourse, type === 'Active', this.dataSource.data);
    if (e.checked === false) {
       if (this.selectedCourse) {
       // this.dataSource.filter = this.selectedCourse;
        this.dataSource.data = this.copyDataSource;
       } else {
         this.dataSource.filter =  '';
         this.isCourseSelected = false;
       }
    } else {
      type = type.trim(); // Remove whitespace
      type = type.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      if (type === 'active') {
        console.log(type);
        this.findActive();
      } else {
        this.isCourseSelected = true;
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
