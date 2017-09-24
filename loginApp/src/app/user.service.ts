import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService{
   private _url : string = "assets/user.json";
   constructor(private _http: Http){}
   
   //.map((response: Response) => response.json());
   getUsers(){
      return this._http.get('assets/user.json')  //, options)
        .map((response: Response) => {
            console.log("mock data" , response.json());
            return response.json();
        }
      )
   }

}
