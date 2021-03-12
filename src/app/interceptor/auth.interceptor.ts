import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';
import {shareReplay} from 'rxjs/operators';
import {AuthenticationService} from '../shared/api/authentication.service';
import {AuthenticationRequest} from '../shared/models/authentication/authentication-request';
import {IntegrationService} from '../shared/api/integration.service';
import {CryptoService} from '../utils/crypto.service';
import {ClientData} from '../shared/constants/client-data';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private _router: Router,
        private _integrationService: IntegrationService,
        private _authenticationService: AuthenticationService,
        private _cryptoService: CryptoService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (localStorage.getItem('authorization')) {

            const authorization = this._cryptoService.decryptData(localStorage.getItem('authorization'));

            let cloneReq;

            if (authorization) {
                cloneReq = req.clone({
                    headers: req.headers.set('Authorization', `${authorization.tokenType} ${authorization.accessToken}`)
                });
            }

            let hanlder: Observable<any> = next.handle(authorization ? cloneReq : req).pipe(shareReplay());

            hanlder = this.handleRequest(hanlder, authorization);

            return hanlder;

        } else {
            let hanlder = next.handle(req).pipe(shareReplay());

            hanlder = this.handleRequest(hanlder);

            return hanlder;
        }

    }

    handleRequest(handler, authorization?): Observable<HttpEvent<any>> {
        handler.toPromise().then().catch(event => {
            if (event instanceof HttpErrorResponse && event.status === 401) {
                if (authorization) {
                    this.refresh(authorization);
                } else {
                    this.authenticate();
                }
            }
        });
        return handler;
    }

    async encryptedParameterExists(): Promise<boolean> {
        const url = this._router.routerState.snapshot.url;
        return  url.includes('enc');
    }

    async refresh(authorization): Promise<any> {
        return this._authenticationService.refresh(authorization.correlationId).catch((e) => {
            this.authenticate();
        });
    }

    async authenticate(): Promise<boolean> {
        return this._integrationService.getCorrelationId().then((response) => {
            const correlationId = response.data.correlationId;
            return this._authenticationService.authenticate(ClientData.getAuthenticationRequest(), correlationId);
        });
    }

}
