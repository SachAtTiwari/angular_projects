import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService} from '../devotee.service';

import { utils, write, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css'],
  providers: [UserService]

})
export class DownloadsComponent implements OnInit {

  constructor(private _userService:UserService) { }
  isLoggedIn = false;
  ngOnInit() {
    let getLoggedIn = localStorage.getItem("token");
    //console.log("token is in atte init",getLoggedIn);
    if(getLoggedIn){
        this._userService.isTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
            console.log("token res", tokenRes);
            if(tokenRes.result == "ok"){
              this.isLoggedIn = true;
            }else{
              console.log("token res in else", tokenRes);
              localStorage.clear();

            }
        })
      }
  }

  course = '';
  counsellor = '';

  courses = [
    {value:"OTP"},
    {value:"TSSV"},
    {value:"ASHRAY1"},
    {value:"ASHRAY2"},
  ];

  counsellors = [
    {value:"HG Shyam Gopal Prabhuji"},
    {value:"HG Kalpvraksha Prabhuji"},
    {value:"HG Vaidant Chaitnya Prabhuji"},
    {value:"HG Pundrik Vidhyanidhi Prabhuji"},
    {value:"HG Jagdanand Pandit Prabhuji"},
    
  ];

  downloadExCounsellor(form: NgForm){
    console.log("in counsellor", form.value, this.counsellor, this.course);

    this._userService.downloadToExCounsellor(form.value)
    .subscribe(userData => {
       console.log("user data is ", userData.result);
       let result_json = [];
       for(var i = 0;i < userData.result.length;i++){
         let objectToInsert = {};
         
         objectToInsert["name"] = userData.result[i].name;
         objectToInsert["contact"] = userData.result[i].contact;
         objectToInsert["course"] = userData.result[i].course;
         objectToInsert["counsellor"] = userData.result[i].counsellor;
         let iterLen = 0;
//         console.log("att is  ", userData.result[i]);
         if(userData.result[i].attendance !== undefined){
          if(userData.result[i].attendance.length >= 8 ){
            iterLen = 8;
          }else{
            iterLen = userData.result[i].attendance.length;
          }
         }
         for(var j = 0;j < iterLen;j++){
               objectToInsert[userData.result[i].attendance[j].date] = userData.result[i].attendance[j].present;
          }
         result_json.push(objectToInsert);
       }
       
       
       const ws_name = 'Attendance';
       const wb: WorkBook = { SheetNames: [], Sheets: {} };
       const ws: any = utils.json_to_sheet(result_json);
       wb.SheetNames.push(ws_name);
       wb.Sheets[ws_name] = ws; 
       const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' }); 
   
       function s2ab(s) {
         const buf = new ArrayBuffer(s.length);
         const view = new Uint8Array(buf);
         for (let i = 0; i !== s.length; ++i) {
           view[i] = s.charCodeAt(i) & 0xFF;
         };  
         return buf;
       }   
   
       saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
           form.value.course + '_' + form.value.counsellor + '.xlsx');
   });
  }




  downloadToExcel(form: NgForm){

    form.value.date = this._userService.parseDate(form.value.date);
    this._userService.downloadToExcel(form.value)
    .subscribe(userData => {
       //console.log("user data is ", userData.result);
       let result_json = [];
       for(var i = 0;i < userData.result.length;i++){
         let objectToInsert = {};
         
         objectToInsert["name"] = userData.result[i].name;
         objectToInsert["contact"] = userData.result[i].contact;
         objectToInsert["course"] = userData.result[i].course;
         objectToInsert["counsellor"] = userData.result[i].counsellor;
         if(userData.result[i].attendance !== undefined){
         for(var j = 0;j < userData.result[i].attendance.length;j++){
           if(userData.result[i].attendance[j].date.localeCompare(form.value.date) == 0){
             objectToInsert["date"] = userData.result[i].attendance[j].date;
             objectToInsert["present"] = userData.result[i].attendance[j].present;
             objectToInsert["topic"] = userData.result[i].attendance[j].topic;
             objectToInsert["speaker"] = userData.result[i].attendance[j].speaker;
             break;
           }
          
        }
      }
      result_json.push(objectToInsert);
      }
       
       
       const ws_name = 'Attendance';
       const wb: WorkBook = { SheetNames: [], Sheets: {} };
       const ws: any = utils.json_to_sheet(result_json);
       wb.SheetNames.push(ws_name);
       wb['!autofilter'] = { ref: "C4" };
       wb.Sheets[ws_name] = ws; 
       const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' }); 
   
       function s2ab(s) {
         const buf = new ArrayBuffer(s.length);
         const view = new Uint8Array(buf);
         for (let i = 0; i !== s.length; ++i) {
           view[i] = s.charCodeAt(i) & 0xFF;
         };  
         return buf;
       }   
   
       saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
           form.value.date + '_' + form.value.course  + '.xlsx');
   });                                                                         
  }
}
