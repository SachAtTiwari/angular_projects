import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService} from '../devotee.service';
import * as XLSX from 'xlsx';
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
       const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(userData.result);
      console.log("1");
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      console.log("2");
      
      /* save to file */
      const wbout: string = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([wbout]), 'OTP.xlsx');
   });                                                                         
  }
}
