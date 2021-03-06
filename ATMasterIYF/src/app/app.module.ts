import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { DataTablesModule } from 'angular-datatables';


import { RouterModule, Routes } from '@angular/router';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';

import { CdkTableModule } from '@angular/cdk/table';
import { A11yModule } from '@angular/cdk/a11y';
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { ObserversModule } from '@angular/cdk/observers';
import { PortalModule } from '@angular/cdk/portal';



import 'hammerjs';
import { ClassComponent } from './class/class.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { DownloadsComponent } from './downloads/downloads.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { MarkpresentComponent } from './attendance/attendance.component';
import { ShowdetailsComponent } from './showdetails/showdetails.component';
import { AddDevoteeComponent } from './attendance/attendance.component';
import { EditDevoteeComponent } from './attendance/attendance.component';
import { EditDevoteeConfirm } from './attendance/attendance.component';
import { MainAttendanceComponent } from './attendance/attendance.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { CounsellorLoginComponent } from './counsellor-login/counsellor-login.component';
import { CallingDetailsComponent, MultipleCourseComponent } from './calling-details/calling-details.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
// Import angular-fusioncharts
import { FusionChartsModule } from 'angular-fusioncharts';

// Import FusionCharts library
import * as FusionCharts from 'fusioncharts';

// Load FusionCharts Individual Charts
import * as Charts from 'fusioncharts/fusioncharts.charts';
import { CallAttDashboardComponent } from './call-att-dashboard/call-att-dashboard.component';
import { CounselorDetailsComponent } from './counselor-details/counselor-details.component';
import { DyshandlerComponent } from './dyshandler/dyshandler.component';

// Use fcRoot function to inject FusionCharts library, and the modules you want to use
FusionChartsModule.fcRoot(FusionCharts, Charts);


const appRoutes: Routes = [
  { path: 'showDetails/:id', component: ShowdetailsComponent},
  { path: 'classSdl', component: ClassComponent},
  { path: 'attendance', component: AttendanceComponent},
  { path: 'otpattendance', component: MainAttendanceComponent},
  { path: 'tssvattendance', component: MainAttendanceComponent},
  { path: 'bssattendance', component: MainAttendanceComponent},
  { path: 'umangattendance', component: MainAttendanceComponent},
  { path: 'dysattendance', component: MainAttendanceComponent},
  { path: 'ashrayattendance', component: MainAttendanceComponent},
  { path: 'downloads', component: DownloadsComponent},
  { path: 'adminLogin', component: AdminLoginComponent},
  { path: 'counLogin', component: CounsellorLoginComponent},
  { path: 'sgpcounsellee', component: CounselorDetailsComponent},
  { path: 'callingdetails/:username', component: CallingDetailsComponent},
  { path: 'callDashboard', component: CallAttDashboardComponent},
  { path: '', redirectTo: 'classSdl', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ClassComponent,
    AttendanceComponent,
    DownloadsComponent,
    MarkpresentComponent,
    ShowdetailsComponent,
    AddDevoteeComponent,
    EditDevoteeComponent,
    MainAttendanceComponent,
    EditDevoteeConfirm,
    AdminLoginComponent,
    CounsellorLoginComponent,
    CallingDetailsComponent,
    CallAttDashboardComponent,
    MultipleCourseComponent,
    CounselorDetailsComponent,
    DyshandlerComponent,
  ],
  entryComponents: [
    MarkpresentComponent,
    AddDevoteeComponent,
    EditDevoteeComponent,
    EditDevoteeConfirm,
    MainAttendanceComponent,
    ShowdetailsComponent,
    MultipleCourseComponent,
    DyshandlerComponent,

  ],
  imports: [
    DataTablesModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    Ng2SmartTableModule,
  	HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false,  useHash: true },
    ),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
	FusionChartsModule 
  ],
  exports: [
    // Material Modules
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatTableModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatStepperModule,
    CdkTableModule,
    A11yModule,
    BidiModule,
    ObserversModule,
    OverlayModule,
    PlatformModule,
    PortalModule,
    RouterModule,
    Ng2SmartTableModule,
    ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
