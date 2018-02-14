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
    {value:"ASHRAY 1"},
    {value:"ASHRAY 2"}
  ];
  counsellors = [
    {value:"KVP"},
    {value:"SGP"}

  ];

  onSubmit(form: NgForm){

    //console.log("form is", form.value);
    this._userService.downloadToExcel(form.value)
    .subscribe(userData => {
       console.log("user data is ", userData.result[0]);
       const result_json = [];
       const objectToInsert = {};
       objectToInsert["name"] = userData.result[0].name;
       objectToInsert["contact"] = userData.result[0].contact;
       objectToInsert["course"] = userData.result[0].course;
       objectToInsert["counsellor"] = userData.result[0].counsellor;
       objectToInsert["date"] = userData.result[0].attendance[0].date;
       objectToInsert["present"] = userData.result[0].attendance[0].present;

       result_json.push(objectToInsert);
       console.log("main result", result_json);
       
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
   
       saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'OTP.xlsx');
   });                                                                         
  }
}
