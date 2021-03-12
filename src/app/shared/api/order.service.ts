import {Inject, Injectable} from '@angular/core';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cart} from '../models/cart/cart';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {CryptoService} from '../../utils/crypto.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {DOCUMENT} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private readonly GENERAL = ServiceCommonConstants.baseUrl;

    locale: string;
    authorization: any;
    data1: SafeHtml;

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
        private _cryptoService: CryptoService,
        private sanitizer: DomSanitizer,
        @Inject(DOCUMENT) private document: any
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

    createOrder(cart: Cart | any, lastname: string): Observable<any> {
        return this._http.post(`${this.GENERAL}/booking/order?lastName=${lastname}`, cart); // , this.HTTP_OPTIONS(this.locale, this.authorization)
    }

    getOrder(orderId: string, lastname: string): Observable<any> {
        return this._http.get(`${this.GENERAL}/booking/order/${orderId}?lastName=${lastname}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    getPurchaseInfo(orderId: string, lastname: string): Observable<any> {
        if (localStorage.getItem('authorization')) {
            this.authorization = this._cryptoService.decryptData(localStorage.getItem('authorization'));
        }
        return this._http.get(`${this.GENERAL}/booking/order/${orderId}/purchase?lastName=${lastname}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    createPayment(url: string, data: any): Observable<any> {
        return this._http.post(url, data, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

}
