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
import { DyshandlerComponent } from '../dyshandler/dyshandler.component';
import {AppComponent} from '../app.component';
import { createAotUrlResolver } from '@angular/compiler';



declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [
    UserService,
  ]
})

export class AttendanceComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name', 'contact', 'counsellor', 'course', 'actions'];
  ELEMENT_DATA: Element[] = [];
  DETAILS_DATA: Element[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  dataSourceDetails = new MatTableDataSource<any>(this.DETAILS_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorDetails: MatPaginator;

  contact: string;
  launchModal = false;
  showAddDevotee = false;
  formError = '';
  topic = '';
  devoteeData = {contact: ''};
  loading = false;
  con = '';
  values = '';
  showAllSwitch = true;
  dStatus = {};
  devotees = [];
  getOTPData = false;
  isLoggedIn = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  counsellors = [
    {value: 'HG Shyam Gopal Prabhuji'},
    {value: 'HG Kalpvraksha Prabhuji'},
    {value: 'HG Vaidant Chaitnya Prabhuji'},
    {value: 'HG Pundrik Vidhyanidhi Prabhuji'},
    {value: 'HG Jagadanand Pandit Prabhuji'},
    {value: 'NA'},
  ];

  courses = [
    {value: 'OTP'},
    {value: 'TSSV'},
    {value: 'ASHRAY'},
    {value: 'BSS'},
    {value: 'UMANG'},
    {value: 'DYS'},
  ];


  /* getPageDetails(e) {
    console.log(e.pageSize);
    this._getDevotees({course:5});
  }*/

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceDetails.paginator = this.paginatorDetails;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private router: Router,
    public snackBar: MatSnackBar, private appComp: AppComponent) { }

  ngOnInit() {
   // console.log("in attendance");
    this.route.queryParams.subscribe(params => {
        if (params['course'] === '5') {
          this.showAddDevotee = true;
          this._getDevotees(params);
        }
    });
    if ($(window).width() < 600) {
      $('.left-pane')[0].style.display = 'none';
    }
  }

  getErrorMessage() {
    return this.email.hasError('requirceed') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  _getDevotees(params) {

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

    // get all devotees
    this._userService.getDevotees(params['course'])
    .subscribe(userData => {
       if (userData.result) {
         userData.result = userData.result.filter(function(el) {
            return el.username !== 'admin';
         });
        }
        if (userData.sdlResult && userData.sdlResult.length > 0) {
          this.dataSource.data = userData.result;
        }else if (!userData.sdlResult && userData.result.length >= 0 && params['course'] === '5') {
            this.showAllSwitch = false;
            this.dataSource.data = userData.result;
        }else {
          this.router.navigateByUrl('/classSdl');
        }
     });
  }


  showDetails(dv) {
    this._userService.getDetails(dv['_id'])
    .subscribe(userData => {
           if (userData.result[0].attendance) {
            this.dataSourceDetails.data = userData.result[0].attendance;
            userData.result[0].dataSourceDetails = this.dataSourceDetails;
           }
           const dialogRef = this.dialog.open(ShowdetailsComponent, {
            width: '100vh',
            hasBackdrop: false,
            data: {...userData.result[0]}
          });
          /*dialogRef.afterClosed().subscribe(result => {
            console.log('result is', result);
          });*/
    });
  }


  handleDevoteeDialog() {
    const dialogRef = this.dialog.open(AddDevoteeComponent, {
      width: '100vh',
      hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.name || !result.email
        || !result.contact || !result.dob
        || !result.counsellor || !result.course) {
          this.formError = 'All fields are mandatory';
      }else {
       this._userService.addDevoteeGeneric(result)
       .subscribe(userData => {
         if (userData['result'] === 'ok') {
          window.location.reload();
          swal({

              type: 'success',
              title: 'Hare Krishna, We have new devotee in IYF',
              html: 'Hari Bol!!',
              showConfirmButton: false,
              timer: 1500
          });
         }else {
            swal({

              type: 'warning',
              title: 'Hare Krishna, We already have this record',
              html: 'Hari Bol!!',
              showConfirmButton: false,
              timer: 1500
          });
          }
         });
       }
    });
  }


  editDevoteeDialog(dv) {
    const dialogRef = this.dialog.open(EditDevoteeComponent, {
      width: '100vh',
      height: '60vh',
      hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.dob) {
        result.dob = this._userService.parseDate(result.dob);
      }
      result._id = dv._id;
       this._userService.editDevotee(result)
       .subscribe(userData => {
         if (userData['result'] === 'ok') {
          swal({

              type: 'success',
              title: 'Record updated successfully',
              html: 'Hari Bol!!',
              showConfirmButton: false,
              timer: 1500
          });
         }
        });
    });
  }


  delRecord(dv) {
      this._userService.delRecord(dv.contact)
      .subscribe(userData => {
        if (userData['result'] === 'ok') {
          console.log('in del record', userData);
         }
      });
    }
}



@Component({
  selector: 'mark-present',
  templateUrl: 'mark-present.html',

})
export class MarkpresentComponent {

  constructor(
    public dialogRef: MatDialogRef<MarkpresentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  status = [
      {value: 'YES'},
      {value: 'NO'}
  ];

  updateAtt(form: NgForm): void {
    this.dialogRef.close(form.value);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'main-attendance',
  templateUrl: 'main-attendance.html',
  styleUrls: ['./main-attendance.css'],
  providers: [
    UserService,
  ]

})
export class MainAttendanceComponent implements OnInit, AfterViewInit {
  startDate = new Date(1987, 0, 1);
  contact: string;
  devoteeData = {contact: '', contact2: '', counsellor: '', course: '', email: '', dob: '', name: ''};
  loading = false;
  dStatus = {};
  attendanceArray = [];
  topic: string;
  displayedColumns = ['Name', 'Contact', 'Attendance'];
  dataSource = new MatTableDataSource([]);

  isLoggedIn = false;
  todayDate = new Date();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private router: Router,
    public snackBar: MatSnackBar, private appComp: AppComponent) {}

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  ngOnInit()  {
    if ($(window).width() < 600) {
      $('.left-pane')[0].style.display = 'none';
    }
    let course = '';
    const todayDateNew = this._userService.parseDate(this.todayDate);
    this.route.queryParams.subscribe(params => {
        // console.log('param is main', params['course']);

        if (params['course'] === '1') {
            course = 'OTP';
        }else if (params['course'] === '2') {
            course = 'TSSV-B10';
        }else if (params['course'] === '3') {
            course = 'ASHRAY';
        }else if (params['course'] === '4') {
            course = 'UMANG';
        }else if (params['course'] === '6') {
            course = 'BSS';
        }else if (params['course'] === '7') {
            course = 'DYS';
        }
    });

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


    this._userService.checkIfClassSdlForCourse(course, todayDateNew)
      .subscribe(sdlresult => {
         if (sdlresult.result.length === 0) {
            this.router.navigateByUrl('/classSdl');

         }else if (sdlresult.result.length !== 0 && course === 'DYS') {
            const dialogRef = this.dialog.open(DyshandlerComponent, {
              width: '280px',
              disableClose: true,
              hasBackdrop: false,
              data: {res: sdlresult.result}
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result.dystopic !== '') {
                this.topic = sdlresult.result[0].topic;
                this.devoteeData.counsellor = this.getSpeakerOfThisTopic(sdlresult, sdlresult.result[0].topic);
              } else {
                this.topic = result.dystopic;
                this.devoteeData.counsellor = this.getSpeakerOfThisTopic(sdlresult, result.dystopic);
              }
              this.devoteeData.course = 'DYS';
            });
         }else {
           this.topic = sdlresult.result[0].topic;
           this.devoteeData.counsellor = sdlresult.result[0].speaker;
           this.devoteeData.course = sdlresult.result[0].course;
         }
      });

      this._userService.getTodayAttendance(course)
      .subscribe(userData => {
          if (userData.result.length !== 0) {
          const result_json = [];
          for (let i = 0; i < userData.result.length; i++) {
            const objectToShow = {};
            objectToShow['name'] = userData.result[i].name;
            objectToShow['contact'] = userData.result[i].contact;
            for (let j = 0; j < userData.result[i].attendance.length; j++) {
              if (userData.result[i].attendance[j].date.localeCompare(todayDateNew) === 0) {
                objectToShow['date'] = userData.result[i].attendance[j].date;
                objectToShow['attendance'] = userData.result[i].attendance[j].present;
                objectToShow['topic'] = userData.result[i].attendance[j].topic;
                objectToShow['speaker'] = userData.result[i].attendance[j].speaker;
                break;
              }
           }
          result_json.push(objectToShow);
          }
        this.attendanceArray = result_json;
        this.dataSource.data = this.attendanceArray;
        }
       });
  }

  getSpeakerOfThisTopic(sdlresult, topic) {

      for (let i = 0; i < sdlresult.result.length; i++) {
        if (sdlresult.result[i].topic === topic) {
          return sdlresult.result[i].speaker;
        }
      }
  }

  _searchedDevotee(contact, isContact, course) {
      this._userService.getSearchedDevotee(contact, course)
      .subscribe(userData => {
          if (userData.sdlResult) {
              swal({

                  type: 'error',
                  title: 'No Data Found, Please add details',
                  html: 'Hari Bol!!',
                  showConfirmButton: false,
                  timer: 1500
              });
              this.loading = false;
              if (isContact) {
                this.devoteeData = {contact: contact, contact2: '',
                course: userData.sdlResult[0].course,
                counsellor: userData.sdlResult[0].counsellor,
                email: '', dob: '', name: ''};
              } else {
                this.devoteeData = {email: contact, contact2: '',
                course: userData.sdlResult[0].course,
                counsellor: userData.sdlResult[0].counsellor,
                contact: '', dob: '', name: ''};
              }
          }else if (userData.result === 'notok') {
            swal({

                  type: 'error',
                  title: 'Class not scheduled for OTP',
                  html: 'Hari Bol!!',
                  showConfirmButton: false,
                  timer: 1500
              });
            this.loading = false;
          }else {
            this.devoteeData = userData.result[0];
            this.loading = false;
          }
      });
    }


    getSearchedDevotee(contact) {
      const course = this.devoteeData.course;
      this.loading = true;
      let isContact = false;
      if (!isNaN(parseInt(contact))) {
          if (contact.length !== 10 && contact !== undefined) {
              swal({

                  type: 'error',
                  title: 'Invalid mobile no',
                  html: 'Hari Bol!!',
                  showConfirmButton: false,
                  timer: 1500
              });
              this.loading = false;
          }else if (contact.length === 10 && contact !== '') {
              isContact = true;
              this._searchedDevotee(contact, isContact, course);
          }
      }else {
        this._searchedDevotee(contact, isContact, course);
       }
    }

    addDevotee(devoteeForm) {
       if (!devoteeForm.value.name || !devoteeForm.value.email
        || !devoteeForm.value.contact || !devoteeForm.value.dob
        || !devoteeForm.value.course ) {
          swal({

                  type: 'error',
                  title: 'All fields are mandatory',
                  html: '',
                  showConfirmButton: false,
                  timer: 1500
              });
       }else {
        const course = devoteeForm.value.course;
        const contact = devoteeForm.value.contact;
        const name = devoteeForm.value.name;
        this.loading = true;
        this._userService.getSearchedDevotee(this.devoteeData.contact, course)
        .subscribe(userData => {
          const valuesToUpdate = {};
          let misMatch = false;
          if (userData.result && userData.result.length !== 0 ) {
            if (userData.result[0].contact !== this.devoteeData.contact) {
                valuesToUpdate['contact'] = this.devoteeData.contact;
                misMatch = true;
            }
            if (userData.result[0].name !== this.devoteeData.name) {
                valuesToUpdate['name'] = this.devoteeData.name;
                misMatch = true;

            }
            if (userData.result[0].contact2 !== this.devoteeData.contact2) {
              valuesToUpdate['contact2'] = this.devoteeData.contact2;
              misMatch = true;
            }
            if (userData.result[0].email !== this.devoteeData.email) {
              valuesToUpdate['email'] = this.devoteeData.email;
              misMatch = true;
            }
            if (userData.result[0].dob !== this.devoteeData.dob) {
              valuesToUpdate['dob'] = this.devoteeData.dob;
              misMatch = true;
            }
            /*if(userData.result[0].counsellor !== this.devoteeData.counsellor){
              valuesToUpdate["counsellor"] = this.devoteeData.counsellor;
              misMatch = true;
            }*/
            if (userData.result[0].course !== this.devoteeData.course) {
              valuesToUpdate['course'] = this.devoteeData.course;
              misMatch = true;
            }

            if (misMatch) {
              const YES = 'YES';
              const NO = 'NO';
              const dialogRef = this.dialog.open(EditDevoteeConfirm, {
                width: '280px',
                data: { YES: YES, NO: NO, update: valuesToUpdate}
              });
              dialogRef.afterClosed().subscribe(result => {

               if (result === 'YES') {
                valuesToUpdate['_id'] = userData.result[0]._id;
                this._userService.editDevotee(valuesToUpdate)
                .subscribe(editData => {
                  if (editData['result'] === 'ok') {
                    swal({

                        type: 'success',
                        title: 'Record updated successfully',
                        html: '',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.loading = false;
                  }else {
                    swal({

                        type: 'error',
                        title: 'Problem in updating record',
                        html: 'Hari Bol!!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.loading = false;
                  }
                  });
                  // devoteeForm.reset();
                  this.markAttendance(course, contact, name);
               }else {
                 this.loading = false;
               }
              });
            }else {
              this.markAttendance(course, contact, name);
            }
          }else {
              this._userService.addDevotee(this.devoteeData)
              .subscribe(addData => {
                if (addData['result'] === 'ok') {
                  swal({

                        type: 'success',
                        title: 'Hare Krishna, We have new devotee in IYF',
                        html: 'Hari Bol!!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                  this.loading = false;
                  this.attendanceArray.push(
                    {
                      name: this.devoteeData['name'],
                      contact: this.devoteeData['contact'],
                      attendance: 'YES',
                    });
                  this.dataSource.data = this.attendanceArray;
               }else if (addData['result'] === 'updated') {
                swal({

                  type: 'success',
                  title: 'Devotee details updated successfully',
                  html: 'Hari Bol!!',
                  showConfirmButton: false,
                  timer: 1500
                  });
                  this.loading = false;
                }else {
                  swal({

                        type: 'success',
                        title: 'Hare Krishna, Something went wrong, Please try again',
                        html: 'Hari Bol!!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.loading = false;

                }
              });
          }
        });
      }
    }

    handleDysAttendance = (course, contact, name) => {
     // console.log('in dys attendance', this.devoteeData, this.topic);
      const month = this.todayDate.getMonth() + 1;
      const date = this.todayDate.getDate() + '-' + month + '-' + this.todayDate.getFullYear();
      this._userService.checkIfClassSdlForCourse(course, date)
      .subscribe(dysClassData => {
      //    console.log('dys data is ', dysClassData);
          this.dStatus['date'] = date;
          this.dStatus['present'] = 'YES';
          this.dStatus['topic'] = this.topic;
          this.dStatus['speaker'] = this.getSpeakerOfThisTopic(dysClassData, this.topic);
          this.dStatus['contact'] =  contact;
          console.log('d status is  ', this.dStatus);
          this._userService.markAttendance(this.dStatus)
          .subscribe(userDataNew => {
            if (userDataNew['result'] === 'ok') {
              this.loading = false;
              swal({

                  type: 'success',
                  title: 'Attendance updated successfully',
                  html: 'Hari Bol!!',
                  showConfirmButton: false,
                  timer: 1500
              });
              this.attendanceArray.push(
              {
                      name: name,
                      contact: contact,
                      attendance: 'YES',
                      topic: this.topic
              });
              this.dataSource.data = this.attendanceArray;
            } else {
                 swal({

                     type: 'warning',
                     title: 'Attendance already updated',
                     html: 'Hari Bol!!',
                     showConfirmButton: false,
                     timer: 1500
                 });
                this.dataSource.data = this.attendanceArray;
                this.loading = false;
            }
          });

      });

    }
    markAttendance(course, contact, name) {
       console.log('mark attendance', course, this.devoteeData);
       if (course === 'DYS') {
         this.handleDysAttendance(course, contact, name);
       } else {
       let specialCourse = false;
       this.route.queryParams.subscribe(params => {
        if (params['course'] === '4') {
            specialCourse = true;
        }
       });
       if (course !== '') {
          this.loading = true;
          const month = this.todayDate.getMonth() + 1;
          const date = this.todayDate.getDate() + '-' + month + '-' + this.todayDate.getFullYear();
          this._userService.checkIfClassSdlForCourse(specialCourse ? 'UMANG' : course, date)
          .subscribe(userData => {
            if (userData.result.length > 0) {

                this.dStatus['date'] = userData.result[0].date;
                this.dStatus['present'] = 'YES';
                this.dStatus['topic'] = userData.result[0].topic;
                this.dStatus['speaker'] = userData.result[0].speaker;
                // if(this.devoteeData.contact){
                 this.dStatus['contact'] =  contact;
                  this._userService.markAttendance(this.dStatus)
                    .subscribe(userDataNew => {
                      if (userDataNew['result'] === 'ok') {
                        this.loading = false;
                        swal({

                            type: 'success',
                            title: 'Attendance updated successfully',
                            html: 'Hari Bol!!',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.attendanceArray.push(
                        {
                                name: name,
                                contact: contact,
                                attendance: 'YES'
                        });
                        this.dataSource.data = this.attendanceArray;
                      } else {
                           swal({

                               type: 'warning',
                               title: 'Attendance already updated',
                               html: 'Hari Bol!!',
                               showConfirmButton: false,
                               timer: 1500
                           });
                          this.dataSource.data = this.attendanceArray;
                          this.loading = false;
                      }
                    });
                // }
            }else {
               this.loading = false;
              swal({

                  type: 'error',
                  title: 'No class sdl for selected date',
                  html: 'Hari Bol!!',
                  showConfirmButton: false,
                  timer: 1500
              });
            }
          });
      }
    }
  }

}


@Component({
  selector: 'edit-devotee',
  templateUrl: 'edit-devotee.html',
  styleUrls: ['./edit.devotee.css'],
})

export class EditDevoteeComponent {
  startDate = new Date(1987, 0, 1);
  all = true;
  counsellors = [
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
    {value: 'BSS'},
    {value: 'UMANG'},
    {value: 'DYS'},
  ];

  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  constructor(
    public dialogRef: MatDialogRef<MarkpresentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  updateDevotee(form: NgForm): void {
    this.dialogRef.close(form.value);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}


@Component({
  selector: 'edit-devotee',
  templateUrl: 'edit-confirm.html',
  styleUrls: ['./edit-confirm.css'],
})

export class EditDevoteeConfirm implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  ngOnInit() {
  }
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  constructor(
    public dialogRef: MatDialogRef<MarkpresentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(no): void {
    this.dialogRef.close(no);
  }

}

@Component({
  selector: 'add-devotee',
  templateUrl: 'add-devotee.html',
  styleUrls: ['./add-devotee.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddDevoteeComponent implements OnInit {

  all = false;
  startDate = new Date(1987, 0, 1);
  email = new FormControl('', [Validators.required, Validators.email]);
  counsellors = [
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
    {value: 'BSS'},
    {value: 'UMANG'},
    {value: 'DYS'},
  ];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      if (params['course'] === '5') {
        this.all = true;
      }
    });
  }
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }



  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<AddDevoteeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  _addDevotee(form: NgForm): void {
    this.dialogRef.close(form.value);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
