import { Component, OnInit } from '@angular/core';
import { UserService} from '../devotee.service';


@Component({
  selector: 'app-call-att-dashboard',
  templateUrl: './call-att-dashboard.component.html',
  styleUrls: ['./call-att-dashboard.component.css'],
  providers: [UserService],

})
export class CallAttDashboardComponent implements OnInit {

   data: Object = {};
  constructor(private _userService: UserService) { }

  ngOnInit() {
    this._userService.getCounselorDataForDate('8-2-2019', 'sgp')
    .subscribe(cdata => {
        console.log('cdata is ', cdata);
    });
    this.data =  {
        'chart': {
          'caption': 'IYF Calling Attendance Report',
          'xAxisname': 'Course',
          'yAxisName': 'Count',
          'exportenabled': '1',
          'theme': 'fusion'
        },
        'categories': [{
          'category': [{
            'label': 'VL1'
          }, {
            'label': 'VL2'
          }, {
            'label': 'BSS'
          }]
        }],
        'dataset': [{
          'seriesName': 'Expected',
          'data': [{
            'value': '3'
          }, {
            'value': '4'
          }, {
            'value': '5'
          }]
        }, {
          'seriesName': 'Attended',
          'renderAs': 'line',
          'data': [{
            'value': '2'
          }, {
            'value': '1'
          }, {
            'value': '3'
          }]
        }]
      };
  }

}
