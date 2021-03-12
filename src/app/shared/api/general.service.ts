import { Injectable } from '@angular/core';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private readonly GENERAL = ServiceCommonConstants.baseUrl;

  constructor(
      private _http: HttpClient
  ) {
  }

  checkAvailability(): Observable<any> {
    return this._http.get(`${this.GENERAL}/status`);
  }
}
