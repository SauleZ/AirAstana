import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalService {

  private readonly BASE_URL = ServiceCommonConstants.baseUrl;

  private readonly HTTP_OPTIONS = function () {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  };

  constructor(
      private _http: HttpClient
  ) { }

  encrypt(request: any): Observable<any> {
    return this._http.post(`${this.BASE_URL}/security/encrypt`, request, this.HTTP_OPTIONS());
  }

  decrypt(enc: string) {
    return this._http.get(`${this.BASE_URL}/security/decrypt?enc=${enc}`, this.HTTP_OPTIONS());
  }
}
