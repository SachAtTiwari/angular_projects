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
import {AppComponent} from '../app.component';
import { MatTabGroup } from '@angular/material';

@Component({
  selector: 'app-counselor-details',
  templateUrl: './counselor-details.component.html',
  styleUrls: ['./counselor-details.component.css'],
  providers: [UserService]

})
export class CounselorDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorDetails: MatPaginator;
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  filterData = [];
  matTabLabel = ['Junior Batch', 'Senior Batch', 'BSS'];
  selectedIndex = 0;
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private router: Router,
    public snackBar: MatSnackBar, private appComp: AppComponent) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['coun'] === '1') {
        this.getCompleteData('sgp');
      } else if (params['coun'] === '2') {
        this.getCompleteData('kvp');
      }else if (params['coun'] === '3') {
        this.getCompleteData('jnp');
      }else if (params['coun'] === '4') {
        this.getCompleteData('pvnp');
      }else if (params['coun'] === '5') {
        this.getCompleteData('vcp');
      }
  });
  }

  getCompleteData(key) {
    this._userService.getCounsellorData(key)
        .subscribe(data => {
            // console.log('data is ', data);
           this['completeData'] = data.resources;
           this.tabGroup.selectedIndex = 0;
           this.filterData = this['completeData'].filter((dataSet) => {
            return dataSet.course === 'TSSV-B10';
          });
        });
  }

  tabChange(event) {
    if (event.tab.textLabel === 'Senior Batch') {
      this.filterData = this['completeData'].filter((dataSet) => {
        return dataSet.course === 'VL3';
      });
    } else if (event.tab.textLabel === 'BSS') {
      this.filterData = this['completeData'].filter((dataSet) => {
        return dataSet.course === 'BSS';
      });
    } else {
      this.filterData = this['completeData'].filter((dataSet) => {
        return dataSet.course === 'TSSV-B10';
      });
    }
    // else if (event.tab.textLabel === 'OTP') {
    //   this.filterData = this['completeData'].filter((dataSet) => {
    //     return dataSet.course === 'OTP';
    //   });
    // }
  }
}
