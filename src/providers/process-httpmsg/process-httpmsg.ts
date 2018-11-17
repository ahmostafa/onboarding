import { Http,Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

/*
  Generated class for the ProcessHttpmsgProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProcessHttpmsgProvider {

  constructor(public http: Http) {
    console.log('Hello ProcessHttpmsgProvider Provider');
  }

  /**
   * extractData
   */
  public extractData( res:Response) {
    let body = res.json();
    return body || {};
  }

  /**
   * handleError
   */
  public handleError( error:Response | any) {
    let errorMsg: string;
    if(error instanceof Response){
      const body = error.json();
      const err = body.error || JSON.stringify(body);
      errorMsg = `${error.status} - ${error.statusText||''} ${err}`;
    }
    else{
      errorMsg = error.message? error.message : error.toString();
    }
    console.error(errorMsg);
    return Observable.throw(errorMsg);
  }
}
