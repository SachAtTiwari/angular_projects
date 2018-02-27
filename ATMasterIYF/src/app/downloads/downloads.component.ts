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

  ngOnInit() {
  }

  courses = [
    {value:"OTP"},
    {value:"TSSV"},
    {value:"ASHRAY1"},
    {value:"ASHRAY2"}
  ];
  counsellors = [
    {value:"KVP"},
    {value:"SGP"}

  ];

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
         
         for(var j = 0;j < userData.result[i].attendance.length;j++){
           if(userData.result[i].attendance[j].date.localeCompare(form.value.date) == 0){
             objectToInsert["date"] = userData.result[i].attendance[j].date;
             objectToInsert["present"] = userData.result[i].attendance[j].present;
             objectToInsert["topic"] = userData.result[i].attendance[j].topic;
             objectToInsert["speaker"] = userData.result[i].attendance[j].speaker;
             break;
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
