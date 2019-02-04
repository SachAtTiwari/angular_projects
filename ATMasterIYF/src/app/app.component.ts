import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from './devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { DataService } from './data.service';
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService,DataService]
})

export class AppComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog,
    private _userService: UserService,
    private router: Router)  {}


  isLoggedIn = false;
  userName = '';
  adminLogout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigateByUrl('/classSdl');

    // window.location.reload();
  }

  toggleClicked() {
    console.log('toggle clicked');
    if (document.getElementById('sidebar').style.width === '250px' || document.getElementById('sidebar').style.width == "") {
        document.getElementById('sidebar').style.width = '52px';
        document.getElementsByClassName('content-wrapper')[0]['style'].marginLeft = '52px';
        document.getElementById('homefooter').style.width = 'calc(100% - 0px)';
        document.getElementById('sidenavToggler').childNodes[1]['className'] = 'fa fa-fw fa-angle-right';
    }else {
        document.getElementById('sidebar').style.width = '250px';
        document.getElementsByClassName('content-wrapper')[0]['style'].marginLeft = '250px';
        document.getElementById('homefooter').style.width = 'calc(100% - 250px)';
       document.getElementById('sidenavToggler').childNodes[1]['className'] = 'fa fa-fw fa-angle-left';
    }
  }

  ngOnInit() {

    // Check if counsellor logged in
    const cLogIn = localStorage.getItem('ctoken');
    if (cLogIn) {
      this._userService.iscTokenVerified(cLogIn)
      .subscribe(ctokenRes => {
        if (ctokenRes.result === 'ok') {
          this.isLoggedIn = true;
          this.userName = localStorage.getItem('cname');
         // console.log('c log in  ', cLogIn, localStorage.getItem('cname'));
        }
      });
    }

    // check if admin is login
    const getLoggedIn = localStorage.getItem('token');
    if (getLoggedIn) {
        this._userService.isTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
            if (tokenRes.result === 'ok') {
              this.isLoggedIn = true;
            }
        });
    }

    $(document).ready(function() {
      $('#sidebar-collaps i').on('click', function() {
          if ($('.left-pane').hasClass('collapseSideBar')) {
              $('.left-pane').removeClass('collapseSideBar');

          } else {
              $('.left-pane').addClass('collapseSideBar');
          }
      });
        $('#sidebar-collapsM').on('click', function() {
          $('.left-pane')[0].style.display = 'block';
      });
        $('.CloseIcon').on('click', function() {
          $('.left-pane')[0].style.display = 'none';
      });
//      if ($(window).width() < 600) {
//          $('.left-pane').addClass('collapseSideBar');
//      } else {
//          $('.left-pane').removeClass('collapseSideBar');
//      }
  });
  }
}
