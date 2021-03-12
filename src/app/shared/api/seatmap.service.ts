import {Injectable} from '@angular/core';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {CryptoService} from '../../utils/crypto.service';

@Injectable({
    providedIn: 'root'
})
export class SeatmapService {

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

    getSeatmap(orderId: string, lastName: string, flightId: string): Observable<any> {
        const params = `lastName=${lastName}&flightId=${flightId}`;
        return this._http.get(`${this.GENERAL}/booking/order/${orderId}/ancillaries/seats?${params}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    getService(orderId: string, lastName: string): Observable<any> {
        return this._http.get(`${this.GENERAL}/booking/order/${orderId}/ancillaries/services?lastName=${lastName}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    getSpecificSeatFromOrder(orderId: string, seatId: string): Observable<any> {
        return this._http.get(`${this.GENERAL}/booking/order/${orderId}/ancillaries/seats/${seatId}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    deleteSpecificSeatFromOrder(orderId: string, seatId: string, lastName: string): Observable<any> {
        return this._http.delete(`${this.GENERAL}/booking/order/${orderId}/ancillaries/seats/${seatId}?lastName=${lastName}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    addSeatToOrder(orderId: string, seat: any, lastName: string): Observable<any> {
        return this._http.post(`${this.GENERAL}/booking/order/${orderId}/ancillaries/seats?lastName=${lastName}`, seat, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    addServiceToOrder(orderId: string, request: any, lastName: string): Observable<any> {
        return this._http.post(`${this.GENERAL}/booking/order/${orderId}/ancillaries/services?lastName=${lastName}`, request, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    deleteService(orderId: string, servicesId: string, lastName: string): Observable<any> {
        return this._http.delete(`${this.GENERAL}/booking/order/${orderId}/ancillaries/services/${servicesId}?lastName=${lastName}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

    deleteServiceByIds(orderId: string, servicesIds : string, lastName: string): Observable<any> {
        return this._http.delete(`${this.GENERAL}/booking/order/${orderId}/ancillaries/services?serviceIds=${servicesIds}&lastName=${lastName}`, this.HTTP_OPTIONS(this.locale, this.authorization));
    }

}
