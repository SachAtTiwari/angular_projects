import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class UserService{
   private _url : string = "http://localhost:3000/";
   
   constructor(private _http: Http){}
   
   //.map((response: Response) => response.json());
   addDevotee(body){
      /*return this._http.post(this._url + "test")  //, options)
        .map((response: Response) => {
            console.log("mock data" , response.json());
            return response.json();
        }
      )*/

     this._http.post(this._url + "addDevotee", {
        index: 'devotee',
        type:'users',
        body: body
       })
        .subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log("Error occured");
          }
        );
   }

    

}