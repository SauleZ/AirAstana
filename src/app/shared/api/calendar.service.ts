import {Injectable} from '@angular/core';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MainSearchRequest} from '../models/search (itinerary)/main-search-request';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {CryptoService} from '../../utils/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  authorization: any;
  locale: string;
  private readonly GENERAL = ServiceCommonConstants.baseUrl;

  private readonly HTTP_OPTIONS = function (locale: string, authorization: any): any {
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

  searchCalendar(mainSearchRequest: MainSearchRequest): Observable<any> {
    return this._http.post(`${this.GENERAL}/search/calendar`, mainSearchRequest, this.HTTP_OPTIONS(this.locale, this.authorization));
  }

}
