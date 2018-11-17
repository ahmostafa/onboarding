import { baseURL } from './../../serverconnect/baseurl';
import { Observable } from 'rxjs/Observable';
import { ProcessHttpmsgProvider } from './../process-httpmsg/process-httpmsg';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { OnBoardingSlide } from '../../classes/onboardingslide';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
/*
  Generated class for the OnBoardingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OnBoardingProvider {

  constructor(public http: Http ,
    private processHttpmsgProvider:ProcessHttpmsgProvider) {
    console.log('Hello OnBoardingProvider Provider');
  }

  getOnBoardings():Observable<OnBoardingSlide[]>{
    return this.http.get(baseURL)
    .map(res => {return this.processHttpmsgProvider.extractData(res)})
    .catch(error=>{return this.processHttpmsgProvider.handleError(error)})
  }

}
