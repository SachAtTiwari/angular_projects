import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService} from './user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})

export class AppComponent{
  
}
