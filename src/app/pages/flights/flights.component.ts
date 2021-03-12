import {Component, OnDestroy, OnInit} from '@angular/core';
import {State} from '../state';
import {Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ExternalService} from '../../shared/api/external.service';
import {takeUntil} from 'rxjs/operators';
import {CryptoService} from '../../utils/crypto.service';
import {TranslateService} from '@ngx-translate/core';
import {CommunicationService} from '../../../@vex/services/communication/communication.service';

@Component({
    selector: 'vex-flights',
    templateUrl: './flights.component.html',
    styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit, OnDestroy {

    state: any;
    booking: any;
    show = false;
    dataRetrieved = false;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private externalService: ExternalService,
        private cryptoService: CryptoService,
        private translateService: TranslateService,
        private communicationService: CommunicationService
    ) {
        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
        const url = this.router.routerState.snapshot.url;

        if (url.includes('enc')) {
            const enc = url.replace('/?enc=', '');
            this.getSearchParameters(enc);
        } else {
            this.show = true;
        }

        localStorage.setItem('index', '0');
        localStorage.setItem('state', State.FLIGHT_SELECTION_STATE.toString());
        this.state = localStorage.getItem(State.FLIGHT_SELECTION_STATE.toString());
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getChanges($event) {
        this.dataRetrieved = $event;
    }

    getSearchParameters(enc: string): void {
        this.externalService.decrypt(enc).pipe(takeUntil(this._unsubscribeAll)).subscribe((response: any) => {
           if (response && response.data) {
               const responseData = response.data;
               const searchRequest = responseData.searchRequest;

               const authorization = responseData.autorization;

               const accessToken = authorization.accessToken;
               accessToken.correlationId = authorization.correlationId;

               if (localStorage.getItem('enc')) {
                   const encInUse = localStorage.getItem('enc');
                   if (enc !== encInUse) {
                       localStorage.clear();
                       this.communicationService.bookingChange(null);
                       this.updateRetrievedData(accessToken, searchRequest, enc);
                   } else {
                       if (!encInUse) {
                           localStorage.clear();
                           this.communicationService.bookingChange(null);
                       }
                       this.updateRetrievedData(accessToken, searchRequest, enc);
                   }
               } else {
                   localStorage.clear();
                   this.communicationService.bookingChange(null);
                   this.updateRetrievedData(accessToken, searchRequest, enc);
               }

               if (searchRequest.showCalendar) {
                   this.router.navigateByUrl('/calendar');
               }

               this.show = true;
           }
        });
    }

    updateRetrievedData(authorization, searchRequest, enc) {
        // Update the client's authorization data in the system
        localStorage.setItem('authorization', this.cryptoService.encryptData(authorization));

        // Search request form retrieved from airastana.com
        localStorage.setItem('searchRequest', this.cryptoService.encryptData(searchRequest));

        // Enc hash retrieved from browser url
        localStorage.setItem('enc', enc);

        this.communicationService.changeNavigationInfo(searchRequest);

        this.translateService.use(searchRequest.languageCode.toLowerCase());
        this.translateService.currentLang = searchRequest.languageCode.toLowerCase();
    }


    reloadPage($event): void {
        if ($event) {
            this.booking = $event;
        }
    }

    reloadFlightHeader($event): void {
        if ($event) {
            this.state = $event;
        }
    }
}
