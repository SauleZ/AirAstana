import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../../shared/api/authentication.service';
import {IntegrationService} from '../../shared/api/integration.service';
import {CryptoService} from '../../utils/crypto.service';
import {ClientData} from '../../shared/constants/client-data';
import {takeUntil} from 'rxjs/operators';
import {ExternalService} from '../../shared/api/external.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _integrationService: IntegrationService,
        private _authenticationService: AuthenticationService,
        private _externalService: ExternalService,
        private _cryptoService: CryptoService
    ) {}

    async canActivate(route: ActivatedRouteSnapshot | any, state: RouterStateSnapshot): Promise<boolean> {
        if (!this.encryptedParameterExists(route)) {
            if (localStorage.getItem('authorization')) {
                const authorization = this._cryptoService.decryptData(localStorage.getItem('authorization'));

                if (authorization && authorization.correlationId) {
                    return true;
                } else {
                    return this.authenticate();
                }
            } else {
                return this.authenticate()
            }
        } else {
            return true;
        }
    }

    async authenticate(): Promise<boolean> {
        return await this._integrationService.getCorrelationId().then((response) => {
            const correlationId = response.data.correlationId;
            return this._authenticationService.authenticate(ClientData.getAuthenticationRequest(), correlationId);
        });
    }

    encryptedParameterExists(route: ActivatedRouteSnapshot | any): boolean {
        const url = route._routerState.url;
        return url.includes('enc');
    }

}
