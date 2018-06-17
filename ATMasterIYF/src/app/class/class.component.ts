import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService} from '../devotee.service';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Body } from '@angular/http/src/body';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import swal from 'sweetalert2';




@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [UserService]

})
export class ClassComponent implements AfterViewInit, OnInit {

  displayedColumns = ['Date', 'Speaker', 'Course', 'Topic'];
  ELEMENT_DATA: Element[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  sdlClasses = [];
  title = 'ISKCON YOUTH FORUM';
  ifClassSdl = true;
  showForm = true;
  showSdlClass = false;
  speakers = [
    {value: 'HG Shyam Gopal Prabhuji'},
    {value: 'HG Kalpvraksha Prabhuji'},
    {value: 'HG Vaidant Chaitnya Prabhuji'},
    {value: 'HG Pundrik Vidhyanidhi Prabhuji'},
    {value: 'HG Jagadanand Pandit Prabhuji'},
    {value: 'NA'},
  ];

  courses = [
    {value: 'OTP'},
    {value: 'TSSV-B10'},
    {value: 'ASHRAY'},
    {value: 'UMANG'},
    {value: 'BSS'},
    {value: 'DYS'},
  ];
  topic = '';
  date = '';
  isLoggedIn = false;
  constructor(private _userService: UserService, private router: Router) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


   ngOnInit() {
    const getLoggedIn = localStorage.getItem('token');
   // console.log("token is in atte init",getLoggedIn);
    if (getLoggedIn) {
        this._userService.isTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
            if (tokenRes.result === 'ok') {
              this.isLoggedIn = true;
            }
        });
        this._userService.getSdlClasses()
          .subscribe(classInfo => {
            this.dataSource.data = classInfo.result;
        });
    }else {
      this._userService.getSdlClasses()
          .subscribe(classInfo => {
            this.dataSource.data = classInfo.result;
        });
    }
  }


  sdlClass(form: NgForm) {
   form.value.date = this._userService.parseDate(form.value.date);
    if (!form.value.date || !form.value.speaker || !form.value.course
      || !form.value.time || !form.value.topic) {
        swal({

            type: 'warning',
            title: 'All fields are required to Schedule a class',
            html: 'Hari Bol!!',
            showConfirmButton: false,
            timer: 1500
        });
    }else {
      this._userService.checkIfClassSdlForCourse(form.value.course, form.value.date)
      .subscribe(sdlresult => {
         if (sdlresult.result.length === 0) {
            this._userService.SdlClass(form.value);
            form.reset();
            // this.router.navigate(['/downloads']).then(() => { this.router.navigate(['/classSdl']); });
            swal({
                 type: 'success',
                 title: 'Class Scheduled ',
                 html: 'Hari Bol!!',
                 showConfirmButton: false,
                 timer: 1500
             });
         }else {
           swal({
            type: 'success',
            title: 'Class already scheduled for given date and course. ',
            html: 'Hari Bol!!',
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
  }

}
