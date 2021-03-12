import {Injectable} from '@angular/core';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {CryptoService} from '../../utils/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  private readonly GENERAL = ServiceCommonConstants.baseUrl;

  locale: string;
  authorization: any;

  private readonly HTTP_OPTIONS = function (locale: any, authorization: any): any {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Content-Language': locale === null || locale === undefined ? 'en' : locale,
        'X-CorrelationID': authorization.correlationId,
        'Timestamp-GMT': new Date().toISOString(),
        Authorization: `${authorization.tokenType} ${authorization.accessToken}`,
      })
    };
  };

  constructor(
      private _http: HttpClient,
      private _translateService: TranslateService,
      private _cryptoService: CryptoService
  ) {
    this.locale = this._translateService.currentLang;

    this._translateService.onLangChange
        .subscribe((langChangeEvent: LangChangeEvent) => {
          this.locale = langChangeEvent.lang;
        });

    if (localStorage.getItem('authorization')) {
      this.authorization = _cryptoService.decryptData(localStorage.getItem('authorization'));
    }
  }

  public getDictionaryByFamilyCode(fareFamilyCode: string): Observable<any> {
    return this._http.get(`${this.GENERAL}/dictionaries/fareFamily/${fareFamilyCode}`); // , this.HTTP_OPTIONS(this.locale, this.authorization)
  }

  public getTaxesByTaxCode(taxCode: string): Observable<any> {
    return this._http.get(`${this.GENERAL}/dictionaries/taxes/${taxCode}`); // , this.HTTP_OPTIONS(this.locale, this.authorization)
  }

}
