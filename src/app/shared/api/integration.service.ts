import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {map} from 'rxjs/operators';
import {CryptoService} from '../../utils/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {

  private readonly GENERAL = ServiceCommonConstants.baseUrl;

  constructor(
      private _http: HttpClient
  ) { }

  getCorrelationId(): Promise<any>{
    const url = `${this.GENERAL}/security/correlation`;
    return this._http.get(url).toPromise();
  }
}
