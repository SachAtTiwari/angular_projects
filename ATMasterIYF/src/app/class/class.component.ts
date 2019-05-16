import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService} from '../devotee.service';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Body } from '@angular/http/src/body';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import swal from 'sweetalert2';
import {AppComponent} from '../app.component';


declare var jquery: any;
declare var $: any;
import {ViewEncapsulation} from '@angular/core';
import { element } from 'protractor';



@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [UserService],
})
export class ClassComponent implements AfterViewInit, OnInit {

  displayedColumns = ['Date', 'Speaker', 'Facilitator', 'Course', 'Topic', 'Actions'];
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
    {value: 'HG Vedanta Chaitanya Prabhuji'},
    {value: 'HG Pundarika Vidyanidhi Prabhuji'},
    {value: 'HG Jagadanand Pandit Prabhuji'},
    {value: 'NA'},
  ];

  facilitators = [
    {value: 'Vaishnav Pran Prabhu'},
    {value: 'Vallabh Prabhu'},
    {value: 'Abhishek Jaiswal Prabhu'},
    {value: 'Ashutosh Prabhu'},
    {value: 'Vishal Patial Prabhu'},
    {value: 'Mohit Joshi Prabhu'},
    {value: 'Amit Kumar Prabhu'},
    {value: 'Hemant Kumar Prabhu'},
    {value: 'Pawan Pandey Prabhu'},
    {value: 'Chetan Kumar Prabhu'},
    {value: 'Aman Sharma Prabhu'},
    {value: 'Shyamanand Prabhu'},
    {value: 'NA'},
  ];

  courses = [
    {value: 'OTP'},
    {value: 'TSSV-B10'},
    {value: 'VL3'},
    {value: 'UMANG'},
    {value: 'BSS'},
    {value: 'DYS'},
  ];
  topic = '';
  date = '';
  isLoggedIn = false;
  constructor(private _userService: UserService,
     private router: Router,
     private appComp: AppComponent) { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


   ngOnInit() {
    // Check if counsellor logged in
    const cLogIn = localStorage.getItem('ctoken');
    if (cLogIn) {
      this._userService.iscTokenVerified(cLogIn)
      .subscribe(ctokenRes => {
        if (ctokenRes.result === 'ok') {
          this.isLoggedIn = true;
          this.appComp.isLoggedIn = true;
          this.appComp.userName =  localStorage.getItem('cname');
        }
      });
    }

    // check if cousellor is login
    const getLoggedIn = localStorage.getItem('token');
    if (getLoggedIn) {
        this._userService.isTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
            if (tokenRes.result === 'ok') {
              this.isLoggedIn = true;
              this.appComp.isLoggedIn = true;
              this.appComp.userName =  'admin';
            }
        });
      }
    this._userService.getSdlClasses()
    .subscribe(classInfo => {
          this.dataSource.data = classInfo.result;
    });

    if ($(window).width() < 600) {
      $('.left-pane')[0].style.display = 'none';
    }
  }

  DeleteClass = (element) => {
    this._userService.deleteClass(element._id)
        .subscribe(delClass => {
          if (delClass['result'] === 'ok') {
            swal({
              type: 'success',
              title: 'Class Deleted ',
              html: 'Hari Bol!!',
              showConfirmButton: false,
              timer: 1500
            });
          }
      });
  }


  sdlClass(form: NgForm) {
   form.value.date = this._userService.parseDate(form.value.date);
    if (!form.value.date || !form.value.speaker || !form.value.course
      || !form.value.time || !form.value.topic || !form.value.facilitator) {
        swal({

            type: 'warning',
            title: 'All fields are required to Schedule a class',
            html: 'Hari Bol!!',
            showConfirmButton: false,
            timer: 1500
        });
    }else {
        this._userService.SdlClass(form.value);
        form.reset();
        swal({
             type: 'success',
             title: 'Class Scheduled ',
             html: 'Hari Bol!!',
             showConfirmButton: false,
             timer: 1500
         });
    //   else {
    //     this._userService.checkIfClassSdlForCourse(form.value.course, form.value.date)
    //     .subscribe(sdlresult => {
    //       if (sdlresult.result.length === 0) {
    //           this._userService.SdlClass(form.value);
    //           form.reset();
    //           // this.router.navigate(['/downloads']).then(() => { this.router.navigate(['/classSdl']); });
    //           swal({
    //               type: 'success',
    //               title: 'Class Scheduled ',
    //               html: 'Hari Bol!!',
    //               showConfirmButton: false,
    //               timer: 1500
    //           });
    //       }else {
    //         swal({
    //           type: 'success',
    //           title: 'Class already scheduled for given date and course. ',
    //           html: 'Hari Bol!!',
    //           showConfirmButton: false,
    //           timer: 1500
    //         });
    //       }
    //     });
    // }


    }
  }

}
