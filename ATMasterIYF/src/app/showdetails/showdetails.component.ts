import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import swal from 'sweetalert2';
import {ViewEncapsulation} from '@angular/core';





@Component({
  selector: 'app-showdetails',
  templateUrl: './showdetails.component.html',
  styleUrls: ['./showdetails.component.css'],
  providers: [UserService],
  encapsulation: ViewEncapsulation.None

})
export class ShowdetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) { }

  id: string;
  displayedColumns = ['Date', 'Speaker', 'Topic', 'Attendance'];
//  dataSource = new MatTableDataSource([]);
//  data = {contact: '', counsellor: '', course: '', email: '', dob: '', name: '', bace: '', isAlumni: ''};
//  @ViewChild(MatPaginator) paginator: MatPaginator;

  isLoggedIn = false;
  ngOnInit() {
  //  this.dataSource.paginator = this.paginator;
   // const getLoggedIn = localStorage.getItem('token');
   // console.log("token is in atte init",getLoggedIn);
   /* if (getLoggedIn) {
        this._userService.isTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
            if (tokenRes.result === 'ok') {
              this.isLoggedIn = true;
            }
        });

    this.route.params.subscribe(params => {
      this.id =  params['id'];
      this._userService.getDetails(this.id)
      .subscribe(userData => {
           console.log(' user data is ', userData.result);
           if (userData.result[0].attendance) {
            this.dataSource.data = userData.result[0].attendance;
           }
           this.devoteeData = userData.result[0];
         });
       });
     }*/
    }

    updateDevotee(form: NgForm): void {
      form.value._id = this.data['_id'];
   //   console.log('update devotee ', form.value);

      this._userService.editDevotee(form.value)
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
    }

}
