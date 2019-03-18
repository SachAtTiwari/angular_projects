import { Component, OnInit } from '@angular/core';
import { UserService} from '../devotee.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-call-att-dashboard',
  templateUrl: './call-att-dashboard.component.html',
  styleUrls: ['./call-att-dashboard.component.css'],
  providers: [UserService],
})
export class CallAttDashboardComponent implements OnInit {
  
  reportData: Object = {};
  courses = [
    {value: 'OTP'},
    {value: 'TSSV-B10'},
    {value: 'VL3'},
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
   data: Object = {};
  constructor(private _userService: UserService) { }

  ngOnInit() {
	  this.data =  {
        "chart": {
          "caption": "IYF Calling Attendance Report",
          
          "xAxisname": "Course",
          "yAxisName": "Count",
          
          "exportenabled": "1",
          "theme": "fusion"
        },
        "categories": [{
          "category": [{
            "label": "VL1"
          }, {
            "label": "VL2"
          }, {
            "label": "BSS"
          }]
        }],
        "dataset": [{
          "seriesName": "Expected",
          "data": [{
            "value": "3"
          }, {
            "value": "4"
          }, {
            "value": "5"
          }]
        }, {
          "seriesName": "Attended",
          "renderAs": "line",
          "data": [{
            "value": "2"
          }, {
            "value": "1"
          }, {
            "value": "3"
          }]
        }]
      };
  }

  getReport(form) {
   if(form.valid) {
    this._userService.reportCourseCouncellor(this.reportData)
    .subscribe(userData => {
      console.log(userData);
    })
   } 
  }

}
