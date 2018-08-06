import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDrawerToggleResult} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  providers: [
    UserService,
  ]
})
export class AdminLoginComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private router: Router,
   ) { }

  isLoggedIn = false;
  ngOnInit() {
  if ($(window).width() < 600) {
      $('.left-pane')[0].style.display = 'none';
        }
  }

  getErrorMessage() {

  }

  adminLogin(form: NgForm): void {
    this._userService.adminLogin(form.value)
    .subscribe(data => {
      if (data.result === 'ok') {
        this.isLoggedIn = true;
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        window.location.reload();

        this.router.navigate(['/attendance'],
         { queryParams: { course: '5'},

        });
      }else {
        swal({

          type: 'error',
          title: 'Invalid Login Crdentials',
          html: 'Hari Bol:(',
          showConfirmButton: false,
          timer: 1500
      });
      }
     });
  }
}
