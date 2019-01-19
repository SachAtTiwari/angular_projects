import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService} from '../devotee.service';
import { utils, write, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';
import { takeWhile } from 'rxjs/operators';
import { mergeAnalyzedFiles } from '@angular/compiler';
import {AppComponent} from '../app.component';
declare var jquery: any;
declare var $: any;
import {ViewEncapsulation} from '@angular/core';


@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css'],
  providers: [UserService],

})
export class DownloadsComponent implements OnInit {

  constructor(private _userService: UserService, private appComp: AppComponent) { }
  isLoggedIn = false;
  course = '';
  counsellor = '';
  courses = [
    {value: 'OTP'},
    {value: 'TSSV-B10'},
    {value: 'ASHRAY'},
    {value: 'BSS'},
    {value: 'UMANG'},
    {value: 'DYS'},
  ];

  counsellors = [
    {value: 'HG Shyam Gopal Prabhuji'},
    {value: 'HG Kalpvraksha Prabhuji'},
    {value: 'HG Vaidant Chaitnya Prabhuji'},
    {value: 'HG Pundrik Vidhyanidhi Prabhuji'},
    {value: 'HG Jagadanand Pandit Prabhuji'},
    {value: 'NA'},
  ];
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
         // this.userName = localStorage.getItem('cname');
         // console.log('c log in  ', cLogIn, localStorage.getItem('cname'));
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
      if ($(window).width() < 600) {
      $('.left-pane')[0].style.display = 'none';
        }
  }

  excelGenerator = (d1, d2, result_json) => {
    const ws_name = 'Attendance';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    const ws: any = utils.json_to_sheet(result_json);
    wb.SheetNames.push(ws_name);
    wb['!autofilter'] = { ref: 'C4' };
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    }
    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
        d1 + '_' + d2  + '.xlsx');

  }

  checkIfDevoteePresntForGivenDate = (date, myArray) => {
    for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].date === date) {
            return myArray[i];
        }
    }
  }

  downloadCallReportCounsellor = (form: NgForm) => {
      this._userService.downloadCallReportCounsellor(form.value)
      .subscribe(userData => {
          console.log(userData);
          const result_json = [];
          for (let  i = 0; i < userData.result.length; i++) {
            const objectToInsert = {};
            objectToInsert['name'] = userData.result[i].name;
            objectToInsert['contact'] = userData.result[i].contact;
            objectToInsert['course'] = userData.result[i].course;
            objectToInsert['counsellor'] = userData.result[i].counsellor;

            if (userData.result[i].calling !== undefined) {
              for (let j = 0; j < userData.result[i].calling.length; j++) {
                objectToInsert[userData.result[i].calling[j].date] =
                       userData.result[i].calling[j].comment;
              }
            }
         result_json.push(objectToInsert);
        }
        this.excelGenerator(form.value.date, form.value.counsellor, result_json);
      });

  }

  downloadExCounsellor = (form: NgForm) => {
    const classList = [];
    this._userService.getSdlClassesCourse(this.course)
    .subscribe(sdlClass => {
       for (let j = 0; j < 8; j++) {
         if (!sdlClass.result[j]) {
           break;
         } else {
           classList.push(sdlClass.result[j].date);
         }
       }
      // console.log('in class list', classList, classList.length);

     if (classList.length > 0) {
      this._userService.downloadToExCounsellor(form.value)
      .subscribe(userData => {
       const result_json = [];
       for (let i = 0; i < userData.result.length; i++) {
         const objectToInsert = {};
         objectToInsert['name'] = userData.result[i].name;
         objectToInsert['contact'] = userData.result[i].contact;
         objectToInsert['course'] = userData.result[i].course;
         objectToInsert['counsellor'] = userData.result[i].counsellor;
         if ( userData.result[i].dob ) {
           objectToInsert['dob'] = this._userService.parseDate(userData.result[i].dob) ;
         }
         if ( userData.result[i].attendance !== undefined ) {
            objectToInsert['classcount'] = userData.result[i].attendance.length;
         }
         const iterLen = 0;
         // get list of last 8 eight classes
         // check if devotee present for that day
         // search for date in attendance array for given counsellor/course
         // if yes add present else absent
         for (let j = 0; j < 8; j++) {
          if (classList[j] && userData.result[i].attendance !== undefined) {
            let status = {};
            status = this.checkIfDevoteePresntForGivenDate(
              classList[j], userData.result[i].attendance);
            if (status !== undefined) {
              // console.log("status", status);
              if (objectToInsert['status'] !== 'active') {
                objectToInsert['status'] = 'active';
              }
              objectToInsert[classList[j]] = status['present'];
            }
          }
        }
        result_json.push(objectToInsert);
       }
       this.excelGenerator(form.value.course, form.value.counsellor, result_json);
      });
     }
    });
  }


  downloadToExcel = (form: NgForm) => {

    form.value.date = this._userService.parseDate(form.value.date);
    this._userService.downloadToExcel(form.value)
    .subscribe(userData => {
       const result_json = [];
       for (let  i = 0; i < userData.result.length; i++) {
         const objectToInsert = {};
         objectToInsert['name'] = userData.result[i].name;
         objectToInsert['contact'] = userData.result[i].contact;
         objectToInsert['course'] = userData.result[i].course;
         objectToInsert['counsellor'] = userData.result[i].counsellor;
         objectToInsert['dob'] = this._userService.parseDate(userData.result[i].dob);
         if (userData.result[i].attendance !== undefined) {
          objectToInsert['classcount'] = userData.result[i].attendance.length;
          for (let j = 0; j < userData.result[i].attendance.length; j++) {
            if (userData.result[i].attendance[j].date.localeCompare(form.value.date) === 0) {
             objectToInsert['date'] = userData.result[i].attendance[j].date;
             objectToInsert['present'] = userData.result[i].attendance[j].present;
             objectToInsert['topic'] = userData.result[i].attendance[j].topic;
             objectToInsert['speaker'] = userData.result[i].attendance[j].speaker;
             break;
            }
        }
      }
      result_json.push(objectToInsert);
      }
      this.excelGenerator(form.value.date,  form.value.course, result_json);
   });
  }

  downloadCourseExcel = (form: NgForm) => {
    this._userService.downloadCourseExcel(form.value)
    .subscribe(userData => {
       const result_json = [];
       for (let  i = 0; i < userData.result.length; i++) {
         const objectToInsert = {};
         objectToInsert['name'] = userData.result[i].name;
         objectToInsert['contact'] = userData.result[i].contact;
         objectToInsert['course'] = userData.result[i].course;
         objectToInsert['counsellor'] = userData.result[i].counsellor;
         objectToInsert['email'] = userData.result[i].email;
         result_json.push(objectToInsert);
      }
      this.excelGenerator(form.value.course, form.value.course, result_json);
    });
  }
}
