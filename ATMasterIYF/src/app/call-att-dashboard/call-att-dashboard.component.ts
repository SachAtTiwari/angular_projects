import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-call-att-dashboard',
  templateUrl: './call-att-dashboard.component.html',
  styleUrls: ['./call-att-dashboard.component.css']
})
export class CallAttDashboardComponent implements OnInit {
	
   data: Object = {};
  constructor() { }

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

}
