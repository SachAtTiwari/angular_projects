import {Injectable} from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';



@Injectable()

export class UserService {
  private _url: string = 'http://localhost:3000/';
 //  private _url: string = '/';

  constructor(private _http: Http) {}

  adminLogin(form) {
    return this._http.post(this._url + 'adminLogin', {

      body: form
     }).map(
        res => {
          return res.json();
        },
        err => {
          return err.json();
        }
      );
    }

  counLogin(form) {
    return this._http.post(this._url + 'counLogin', {
        body: form
       }).map(
          res => {
            return res.json();
          },
          err => {
            return err.json();
          }
        );
  }

  getOTPDevotees() {
    return this._http.get(this._url + 'getOTPDevotees').map((response: Response) => {
          return response.json();
        }
      );
  }

  updateComment(element) {
    return this._http.post(this._url + 'updateComment', {
      body: element
     }).map(
        res => {
          return res.json();
        },
        err => {
          return err.json();
        }
      );
  }

  getSearchedDevotee(contact, course) {
      let isContact = false;
      if (!isNaN(parseInt(contact))) {
         isContact = true;
      }
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const searchParams = new URLSearchParams();
      if (isContact === true) {
        searchParams.append('contact', contact);
      }else {
        searchParams.append('email', contact);
      }
      searchParams.append('course', course);
      const options = new RequestOptions({ headers: headers, params: searchParams });
      return this._http.get(this._url + 'getSearchedDevotee', options)
        .map((response: Response) => {
            return response.json();
           }
         );
    }

  getCounsellorData(name): Observable<any> {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const searchParams = new URLSearchParams();
      searchParams.append('username', name);
      const options = new RequestOptions({ headers: headers, params: searchParams });
      return this._http.get(this._url + 'getCounsellorData', options)
        .map((response: Response) => {
            return response.json();
        }
      );
  }

  getDevotees(course, token): Observable<any> {
      let courseName = '';
      switch (course) {
        case '1':
          courseName = 'OTP';
          break;
        case '2':
          courseName = 'TSSV';
          break;
        case '3':
          courseName = 'ASHRAY';
          break;
        case '4':
          courseName = 'UMANG';
          break;
        case '5':
          courseName = '';
          break;
        case '6':
          courseName = 'BSS';
          break;
        case '7':
          courseName = 'DYS';
          break;
      }

      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const searchParams = new URLSearchParams();
      searchParams.append('course', courseName);
      searchParams.append('token', token);
      const options = new RequestOptions({ headers: headers, params: searchParams });
      return this._http.get(this._url + 'getDevotees', options)
        .map((response: Response) => {
            return response.json();
           }
         );
       }

  getDetails(id): Observable<any> {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const searchParams = new URLSearchParams();
      const token = localStorage.getItem('token');
      const ctoken = localStorage.getItem('ctoken');
      if (token) {
        searchParams.append('token', token);
      }
      if (ctoken) {
        searchParams.append('ctoken', ctoken);
      }
      searchParams.append('id', id);
      const options = new RequestOptions({ headers: headers, params: searchParams });
      return this._http.get(this._url + 'getDetails', options)
       .map((response: Response) => {
           return response.json();
          }
      );
  }

  getSdlClasses() {
      return this._http.get(this._url + 'getSdlClasses')
        .map((response: Response) => {
            return response.json();
           }
         );
    }

  getSdlClassesCourse(course) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const searchParams = new URLSearchParams();
    searchParams.append('course', course);
    const options = new RequestOptions({ headers: headers, params: searchParams });

    return this._http.get(this._url + 'getSdlClassesCourse', options)
        .map((response: Response) => {
            return response.json();
        }
    );
  }

  checkIfDevoteePresentForGivenDate(date, counsellor, course) {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const searchParams = new URLSearchParams();
      searchParams.append('course', course);
      searchParams.append('date', date);
      searchParams.append('counsellor', counsellor);

      const options = new RequestOptions({ headers: headers, params: searchParams });
      return this._http.get(this._url + 'checkDevoteeStatusForGivenDate')
        .map((response: Response) => {
            return response.json();
           }
      );
  }

  checkIfClassSdlForCourse(course, date): Observable<any> {
      // console.log('check sdl class', course, date);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const searchParams = new URLSearchParams();
      searchParams.append('course', course);
      searchParams.append('date', date);
      const options = new RequestOptions({ headers: headers, params: searchParams });
      return this._http.get(this._url + 'checkClassSdl', options)
          .map((response: Response) => {
            return response.json();
         }
       );
   }


  isTokenVerified(token) {
    // console.log("token in devotee", token);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const searchParams = new URLSearchParams();
    searchParams.append('token', token);
    const options = new RequestOptions({ headers: headers, params: searchParams });
    return this._http.get(this._url + 'isTokenVerified', options)
        .map((response: Response) => {
          return response.json();
       }
     );
  }

  iscTokenVerified(token) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const searchParams = new URLSearchParams();
    searchParams.append('token', token);
    const options = new RequestOptions({ headers: headers, params: searchParams });
    return this._http.get(this._url + 'iscTokenVerified', options)
        .map((response: Response) => {
          return response.json();
       }
     );
  }

  delRecord(contact): Observable <Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const delParams = new URLSearchParams();
    delParams.append('contact', contact);
    const options = new RequestOptions({ headers: headers, params: delParams });


    return this._http.delete(this._url + 'delRecord', options)
      .map(
        res => {
          return res.json();
        },
        err => {
          return err.json();
        }
      );
   }

  addDevotee(body): Observable<Response> {
     return this._http.post(this._url + 'addDevotee', {
        body: body
       }).map(
          res => {
            return res.json();
          },
          err => {
            return err.json();
          }
        );
  }

   addDevoteeGeneric(body): Observable<Response> {
    return this._http.post(this._url + 'addDevoteeGeneric', {
       body: body
      }).map(
         res => {
           return res.json();
         },
         err => {
           return err.json();
         }
       );
    }

  editDevotee(body): Observable<Response> {
    return this._http.put(this._url + 'updateDevotee', {
       body: body
      })
       .map(
         res => {
           return res.json();
         },
         err => {
           return err.json();
         }
       );
  }

   parseDate(date): string {

    const temp_datetime_obj = new Date(date);
    const month = temp_datetime_obj.getMonth() + 1;
    date =  temp_datetime_obj.getDate() + '-' + month + '-' + temp_datetime_obj.getFullYear();
    return date;
   }

   SdlClass(body) {
    this._http.post(this._url + 'sdlClass', {
       body: body
      }).subscribe(
         res => {
           // console.log('res is', res);
         },
         err => {
          // console.log('err is', err);
         }
       );
  }

   markAttendance(attendance): Observable<Response> {
    console.log('atten is ', attendance);
     return this._http.post(this._url + 'markAttendance' , {
            attendance: attendance
       })
       .map(
          res => {
            return res.json();
          },
          err => {
            err.json();
          }
        );
   }


   downloadCallReportCounsellor (dTe) {
    console.log('downlods call report', dTe);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const searchParams = new URLSearchParams();
    searchParams.append('date', dTe.date);
    searchParams.append('counsellor', dTe.counsellor);
    const options = new RequestOptions({ headers: headers, params: searchParams });

    return this._http.get(this._url + 'downloadCallReportCounsellor', options)
        .map((response: Response) => {
          return response.json();
       }
     );
 }



   downloadToExcel (dTe) {
      console.log('downlods', dTe);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      const searchParams = new URLSearchParams();
      searchParams.append('date', dTe.date);
      searchParams.append('course', dTe.course);
      searchParams.append('counsellor', dTe.counsellor);
      const options = new RequestOptions({ headers: headers, params: searchParams });

      return this._http.get(this._url + 'downloadToExcel', options)
          .map((response: Response) => {
            return response.json();
         }
       );
   }

   downloadCourseExcel(dTe) {
    // console.log("atten is ", dTe);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const searchParams = new URLSearchParams();
    searchParams.append('course', dTe.course);
    searchParams.append('isAlumni', dTe.isAlumni);
    const options = new RequestOptions({ headers: headers, params: searchParams });

    return this._http.get(this._url + 'downloadCourseExcel', options)
        .map((response: Response) => {
          return response.json();
       });
  }


   downloadToExCounsellor(dTe) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const searchParams = new URLSearchParams();
    searchParams.append('date', dTe.date);
    searchParams.append('course', dTe.course);
    searchParams.append('counsellor', dTe.counsellor);
    const options = new RequestOptions({ headers: headers, params: searchParams });
    console.log('options ', options);
    return this._http.get(this._url + 'downloadToExCounsellor', options)
        .map((response: Response) => {
          return response.json();
       }
     );
 }

   getTodayAttendance(course) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const searchParams = new URLSearchParams();
    searchParams.append('course', course);
    const options = new RequestOptions({ headers: headers, params: searchParams });

    return this._http.get(this._url + 'getTodayAttendance', options)
        .map((response: Response) => {
          return response.json();
       }
     );
 }
}
