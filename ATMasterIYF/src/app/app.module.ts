import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { Component }                from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { AppMaterialModules } from './material.module';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance.component';




import 'hammerjs';

const appRoutes: Routes = [
  { path: 'attendance-component', component: AttendanceComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    AttendanceComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppMaterialModules,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true},
    )
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }