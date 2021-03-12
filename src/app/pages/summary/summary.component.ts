import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {CalendarCell} from '../../shared/models/calendar/calendar-cell';
import {Filter} from '../../shared/models/filter/filter';
import {Sort} from '../../shared/models/filter/sort';
import {Subject, Subscription} from 'rxjs';
import {BoundsReply} from '../../shared/models/bound/bounds-reply';
import {Bound} from '../../shared/models/bound/bound';
import {FlightService} from '../flights/flight.service';
import {CommunicationService} from '../../../@vex/services/communication/communication.service';
import {IconService} from '../../../@vex/services/icon.service';
import {CalendarService} from '../../shared/api/calendar.service';
import {Router} from '@angular/router';
import {OfferService} from '../../shared/api/offer.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {CartService} from '../../shared/api/cart.service';
import {MatDialog} from '@angular/material/dialog';
import {FakeDb} from '../flights/fake-db';
import {StaticRequest} from '../../shared/api/static-request';
import {takeUntil} from 'rxjs/operators';
import {CartRequest} from '../../shared/models/cart/cart-request';
import {DetailsHeaderComponent} from '../flights/details-header/details-header.component';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {CryptoService} from '../../utils/crypto.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'vex-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit, OnDestroy {

    booking: any;
    // n = this.departureTime.flight.info[0].values[0].timeline[2].additionalInfo.slice(0, 2);
    open = false;

    isMobile = false;
    isTablet = false;
    isDesktop = false;
    globalLoading = true;
    routeDetailsMap: any = {};

    calendarResult: CalendarCell;

    show = true;

    filter: Filter;
    sort: Sort;
    cartResponse: any;
    selectedBoundMap: any = {};
    type: string;

    flights = [];

    subscriptionFilter: Subscription = new Subscription();
    subscriptionSort: Subscription = new Subscription();
    subscriptionState: Subscription = new Subscription();

    boundsReply: BoundsReply;

    arrivalCityName = '';
    departureCityName = '';
    hasSelectedItem = [];
    filterForm: any;

    bounds: Bound[] = [];
    filterChanged = false;
    sortChanged = false;
    flightBoundMap = new Map<string, Bound>();
    passengers: any[] = [];

    searchRequest: any;
    locale: string;

    @Output() selected: EventEmitter<any> = new EventEmitter<any>();

    @Input() state: any;
    @Output() eventExecuted: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('mySelect') mySelect;
    @ViewChild('rate') rate;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    private _unsubscribeAll: Subject<any>;

    constructor(
        private flightService: FlightService,
        private communicationService: CommunicationService,
        public iconService: IconService,
        private calendarService: CalendarService,
        private router: Router,
        private offerService: OfferService,
        private deviceService: DeviceDetectorService,
        private cartService: CartService,
        private _snackBar: MatSnackBar,
        private _translateService: TranslateService,
        private dialog: MatDialog,
        private _cryptoService: CryptoService
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();

        if (localStorage.getItem('booking')) {
            this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));

            if (this.booking.cart && !this.booking.order) {
                this.displayMessage('You didn\'t fulfill passenger information!');
                this.router.navigateByUrl('/passenger');
            } else if (!this.booking.cart && !this.booking.order) {
                this.displayMessage('You didn\'t select any flights!');
                this.router.navigateByUrl('/');
            }
        } else {
            this.displayMessage('You didn\'t select any flights!');
            this.router.navigateByUrl('/');
        }

        if (localStorage.getItem('searchRequest')) {
            this.searchRequest = this._cryptoService.decryptData(localStorage.getItem('searchRequest'));
            // console.log(this.searchRequest);
        }

        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
        this.flights = FakeDb.FLIGHTS;
        this.state = localStorage.getItem('state');

        this.locale = this._translateService.currentLang;
        this._translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
            if (this.locale !== langChangeEvent.lang) {
                this.locale = langChangeEvent.lang;
            }
        });

        if (localStorage.getItem('booking')) {
            this.filterForm = this._cryptoService.decryptData(localStorage.getItem('booking'));
            this.passengers = this.filterForm.p;
            this.departureCityName = this.filterForm.cart.offers[0].bounds[0].originLocation.cityName;
            this.arrivalCityName =  this.filterForm.cart.offers[0].bounds[0].destinationLocation.cityName;
        }

        this.subscriptionFilter = this.communicationService.filterChangeObservable$.subscribe(filter => {
            this.filter = filter;
            this.filterChanged = true
        });

        this.subscriptionSort = this.communicationService.sortChangeObservable$.subscribe(sort => {
            this.sort = sort;
            this.sortChanged = true;
        });

        // this.subscriptionState = this.communicationService.stateChangeObservable$.subscribe(state => {
        //     this.state = state;
        // });
    }

    ngOnDestroy(): void {
        this.subscriptionFilter.unsubscribe();
        this.subscriptionSort.unsubscribe();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    durationIntoDays(duration): number {
        return Math.floor(duration / 8640000);
    }

    stringify(value): string {
        return JSON.stringify(value);
    }

    getTypeName(code: string): string {
        switch (code) {
            case 'ADT':
                return 'Adult';
            case 'CHD':
                return 'Child';
            case 'INF':
                return 'Infant';
        }
    }

    async changeSelected(rateResult, flight, index) {
        this.selectedBoundMap[flight.type] = rateResult;

        const flightType = flight.type === 'Departure' ? 'Return' : 'Departure';
        const firstBoundRate = rateResult.rate;
        const secondBoundRate = this.flightBoundMap[flightType][index].rates[rateResult.rateIndex];

        this.arrivalCityName = this.flightBoundMap[flightType][0].destinationLocation.cityName;
        this.departureCityName = this.flightBoundMap[flightType][0].originLocation.cityName;


        let sameOfferId = null;
        let unionFound = false;

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < firstBoundRate.offerIds.length; i++) {
            const offerId = firstBoundRate.offerIds[i];
            // tslint:disable-next-line:prefer-for-of
            for (let j = 0; j < secondBoundRate.offerIds.length; j++) {
                if (offerId === secondBoundRate.offerIds[j]) {
                    sameOfferId = offerId;
                    unionFound = true;
                    break;
                }
            }
            if (unionFound) break;
        }


        if (sameOfferId != null) {
            const cartRequest = new CartRequest();
            cartRequest.offerId = sameOfferId;
            const result = {
                flight,
                selectedBoundMap: this.selectedBoundMap,
                cart: this.cartResponse,
                offerId: cartRequest.offerId
            };
            this.selected.emit(result);
        }
    }

    openDialog(inbound, flight, i, type: string) {
        const matDialogRef = this.dialog.open(DetailsHeaderComponent, {
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            data: {type, bound: inbound, summary: true},
        });
        matDialogRef.afterClosed().subscribe(res => {
            this.changeSelected(res, flight, i);
        });
    }

    changeBound(flightType: string) {
        delete this.selectedBoundMap[flightType];
        localStorage.removeItem('booking');
    }

    toggle() {
        this.open = !this.open;
    }

    millsIntoHours(duration: number): string {
        let result = '';

        const totalMinutes = duration / 60;
        const totalHours = totalMinutes / 60;

        const minutes = Math.floor(totalMinutes) % 60;
        const hours = Math.floor(totalHours) % 60;

        if (hours !== 0) {
            result += hours + 'h ';

            if (minutes.toString().length === 1) {
                result += '0' + minutes + 'm';
            } else {
                result += minutes + 'm';
            }
        }

        return result;
    }


    countDays(origin: string, destination: string) {
        const departure = new Date(origin);
        const arrival = new Date(destination);

        const diff = Math.abs(departure.getDate() - arrival.getDate());
        return diff;

    }


    priceView(price: string): string {
        let result = '';
        price = price.split('').reverse().join('')
        for (let i = price.length - 1; i >= 0; i--) {
            result += price.charAt(i);
            if (i !== 0 && i % 3 === 0 && !price.includes(',') && !price.includes('.')) {
                result += ' ';
            }
        }
        return result;

    }

    openRouteDetails(flightType: any) {
        if (this.routeDetailsMap[flightType]) {
            this.routeDetailsMap[flightType] = !this.routeDetailsMap[flightType];
        } else {
            this.routeDetailsMap[flightType] = true;

        }
    }

    changeSelectedBound(flightType: any) {
        this.router.navigateByUrl('/');
    }

    getStops(inbound: Bound) {
        const stops = [];
        for (let i = 0; i < inbound.flights.length; i++) {
            if (inbound.flights[i].details.stop) {
                stops.push(inbound.flights[i].details.stop.locationCode);
            }
        }
        return stops;
    }

    displayMessage(text: string): void {
        this._snackBar.open(text, '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

}
