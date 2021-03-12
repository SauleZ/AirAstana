import {Injectable} from '@angular/core';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CartRequest} from '../models/cart/cart-request';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {CryptoService} from '../../utils/crypto.service';

@Injectable({
    providedIn: 'root'
})
export class CartService {

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

    createCart(cartRequest: CartRequest): Observable<any> {
        return this._http.post(`${this.GENERAL}/booking/cart`, cartRequest, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    getCart(cartId: string, surname: string): Observable<any> {
        return this._http.get(`${this.GENERAL}/booking/cart/${cartId}?lastName=${surname}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    updateCart(cartId: string, cartRequest: CartRequest, surname: string): Observable<any> {
        return this._http.patch(`${this.GENERAL}/booking/cart/${cartId}?lastName=${surname}`, cartRequest, this.HTTP_OPTIONS(this.locale, this.authorization));
    }


}
