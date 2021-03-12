import {Injectable} from '@angular/core';
import {ServiceCommonConstants} from '../constants/service-common-constants';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthenticationRequest} from '../models/authentication/authentication-request';
import {map} from 'rxjs/operators';
import {AuthenticationResponse} from '../models/authentication/authentication-response';
import {ErrorMessage} from '../models/messages/error-message';
import {Router} from '@angular/router';
import {CryptoService} from '../../utils/crypto.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private readonly GENERAL = ServiceCommonConstants.baseUrl;
    private authorization: any;

    private readonly HTTP_OPTIONS = function (correlationId): any {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-CorrelationID': correlationId
            })
        };
    };

    constructor(
        private _http: HttpClient,
        private _router: Router,
        private _cryptoService: CryptoService
    ) {
        if (localStorage.getItem('authorization')) {
            this.authorization = _cryptoService.decryptData(localStorage.getItem('authorization'));
        }
    }

    async authenticate(request: AuthenticationRequest, correlationId?: string): Promise<boolean> {
        const url = `${this.GENERAL}/security/oauth2/token`;
        let result = false;

        const correlation = correlationId ? correlationId : this.authorization.correlationId;

        return this._http.post(url, request, this.HTTP_OPTIONS(correlation)).pipe(map((response: any) => {
            const data = response.data;

            if (data !== null) {
                this.clearAllExceptForToken();

                data.correlationId = correlation;
                localStorage.setItem('authorization', this._cryptoService.encryptData(data));
                result = true;
            }

            window.location.reload();

            return result;
        })).toPromise();
    }

    async refresh(correlationId): Promise<boolean> {
        const url = `${this.GENERAL}/security/oauth2/token/refresh?refreshToken=${this.authorization.refreshToken}`;
        const correlation = correlationId ? correlationId : this.authorization.correlationId;

        return this._http.get(url, this.HTTP_OPTIONS(correlation)).pipe(map((response: any) => {
            const data = response.data;

            if (data !== null) {
                data.correlationId = correlation;
                localStorage.setItem('authorization', this._cryptoService.encryptData(data));
                return true;
            }

            window.location.reload();

            return false;
        })).toPromise();
    }

    clearAllExceptForToken(): void {
        // localStorage.removeItem('filterForm');
        localStorage.removeItem('booking');
        localStorage.removeItem('flights');
        localStorage.removeItem('index');
        localStorage.removeItem('state');
        localStorage.removeItem('pForm');
        localStorage.removeItem('taxInfo');
        localStorage.removeItem('filter');
    }
}
