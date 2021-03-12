import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Filter} from '../../../shared/models/filter/filter';
import {Subject, Subscription} from 'rxjs';
import {FlightService} from '../flight.service';
import {CommunicationService} from '../../../../@vex/services/communication/communication.service';
import {IconService} from '../../../../@vex/services/icon.service';
import {CalendarService} from '../../../shared/api/calendar.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {FakeDb} from '../fake-db';
import {BoundsReply} from '../../../shared/models/bound/bounds-reply';
import {Bound} from '../../../shared/models/bound/bound';
import {StaticRequest} from '../../../shared/api/static-request';
import {OfferService} from '../../../shared/api/offer.service';
import {CartService} from '../../../shared/api/cart.service';
import {DatePipe} from '@angular/common';
import {CalendarCell} from '../../../shared/models/calendar/calendar-cell';
import {CartRequest} from '../../../shared/models/cart/cart-request';
import {DetailsHeaderComponent} from '../details-header/details-header.component';
import {MatDialog} from '@angular/material/dialog';
import {Sort} from '../../../shared/models/filter/sort';
import {DictionaryService} from '../../../shared/api/dictionary.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {CryptoService} from '../../../utils/crypto.service';


@Component({
    selector: 'vex-flight-bounds',
    templateUrl: './flight-bounds.component.html',
    styleUrls: ['./flight-bounds.component.scss']
})
export class FlightBoundsComponent implements OnInit, OnDestroy {

    rateTest;
    expanded = false;
    isMobile = false;
    isTablet = false;
    isDesktop = false;
    globalLoading = true;
    check = true;

    booking: any;
    arrivalCityName = '';
    departureCityName = '';
    minDuration = 0;
    maxDuration = 0;

    calendarResult: CalendarCell;
    initialBoundMap = {};

    show = true;

    filter: Filter;
    sort: Sort;
    cartResponse: any;
    selectedBoundMap: any = {};
    openedBoundMap: any = {};
    typeMap: any = {};
    type: string;

    flights = [];

    subscriptionFilter: Subscription = new Subscription();
    subscriptionSort: Subscription = new Subscription();
    subscriptionState: Subscription = new Subscription();

    boundsReply: BoundsReply;

    bounds: Bound[] = [];
    filterChanged = false;
    sortChanged = false;
    flightBoundMap = {};
    locale: string;

    fareFamilyDictionary: any = {};

    @Output() selected: EventEmitter<any> = new EventEmitter<any>();

    @Input() state: any;
    @Output() eventExecuted: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild('mySelect') mySelect;
    @ViewChild('rate') rate;

    @Input() dataRetrieved: boolean;
    @Output() dataRetrieveEvent = new EventEmitter<any>();

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    private _unsubscribeAll: Subject<any>;
    searchRequest: any;

    constructor(
        private flightService: FlightService,
        public communicationService: CommunicationService,
        public iconService: IconService,
        private calendarService: CalendarService,
        private router: Router,
        private offerService: OfferService,
        private deviceService: DeviceDetectorService,
        private cartService: CartService,
        private dictionaryService: DictionaryService,
        private dialog: MatDialog,
        private _translateService: TranslateService,
        private _snackBar: MatSnackBar,
        private _cryptoService: CryptoService
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();

        this._unsubscribeAll = new Subject<any>();

        if (localStorage.getItem('searchRequest')) {
            this.searchRequest = this._cryptoService.decryptData(localStorage.getItem('searchRequest'));
            // console.log(this.searchRequest);

            if (localStorage.getItem('calendarResult')) {
                this.calendarResult = this._cryptoService.decryptData(localStorage.getItem('calendarResult'));
                if (this.searchRequest.showCalendar && !this.calendarResult) {
                    this.router.navigateByUrl('/calendar');
                }
            }
        } else {
            if (localStorage.getItem('calendarResult')) {
                this.calendarResult = this._cryptoService.decryptData(localStorage.getItem('calendarResult'));
            } else {
                this.router.navigateByUrl('/calendar');
            }
        }

        if (localStorage.getItem('booking')) {
            this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
            // console.log('booking', this.booking);
            this.selectedBoundMap = this.booking.selectedBoundMap;
        }

        this.filterGetBounds();

    }

    ngOnInit(): void {
        this.locale = this._translateService.currentLang;
        this._translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
            if (this.locale !== langChangeEvent.lang) {
                this.locale = langChangeEvent.lang;
            }
        });

        this.flights = FakeDb.FLIGHTS;

        this.state = localStorage.getItem('state');

        this.subscriptionFilter = this.communicationService.filterChangeObservable$.subscribe((filter: Filter) => {
            this.filter = filter;
            this.getFilteredBounds();
        });

        this.subscriptionSort = this.communicationService.sortChangeObservable$.subscribe(sort => {
            this.sort = sort;
            this.sortChanged = true;

            this.sortBounds(this.sort);
        });

        this.subscriptionState = this.communicationService.stateChangeObservable$.subscribe(state => {
            this.state = state;
        });

    }

    ngOnDestroy(): void {
        this.subscriptionFilter.unsubscribe();
        this.subscriptionSort.unsubscribe();
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    filterGetBounds() {
        if (this.searchRequest) {
            if (this.searchRequest.showCalendar && this.calendarResult) {
                const request = this.searchRequest;
                request.itineraries[0].departureDateTime = this.calendarResult.departureDate;
                if (this.searchRequest.itineraries.length > 1) {
                    request.itineraries[1].departureDateTime = this.calendarResult.returnDate;
                }
                this.getBounds(request);

            } else {
                this.getBounds(this.searchRequest);
            }
        } else {
            if (this.calendarResult) {
                const request = StaticRequest.SEARCH_BOUNDS_BODY_2;
                request.itineraries[0].departureDateTime = this.calendarResult.departureDate;
                if (this.searchRequest && this.searchRequest.itineraries.length > 1) {
                    request.itineraries[1].departureDateTime = this.calendarResult.returnDate;
                }
                this.getBounds(request);
            }
        }
    }

    getFilteredBounds() {
        this.filterChanged = true;

        this.filter.departureFrom *= 60000;
        this.filter.departureTo *= 60000;
        this.filter.arrivalFrom *= 60000;
        this.filter.arrivalTo *= 60000;
        this.filter.durationFrom *= 60000;
        this.filter.durationTo *= 60000;

        this.filterBounds(this.filter);
    }


    getBounds(request: any) {
        this.globalLoading = true;
        this.offerService.searchBounds(request).subscribe(res => {
            this.boundsReply = res.data;

            if (this.boundsReply) {
                const Departure = 'Departure';
                const Return = 'Return';
                this.flightBoundMap[Departure] = this.boundsReply.outbounds;
                this.flightBoundMap[Return] = this.boundsReply.inbounds;
                this.initialBoundMap = this.flightBoundMap;

                this.arrivalCityName = this.flightBoundMap[Departure][0].destinationLocation.cityName;
                this.departureCityName = this.flightBoundMap[Departure][0].originLocation.cityName;

                if (localStorage.getItem('filter')) {
                    this.filter = JSON.parse(localStorage.getItem('filter'));
                    this.getFilteredBounds();
                }
                const bounds = [].concat(this.boundsReply.outbounds.concat(this.boundsReply.inbounds));
                this.minDuration = bounds[0].duration;


                for (let i = 0; i < bounds.length; i++) {

                    if (bounds[i].duration > this.maxDuration) {
                        this.maxDuration = bounds[i].duration;
                    }

                    if (bounds[i].duration < this.minDuration) {
                        this.minDuration = bounds[i].duration;
                    }
                }

                this.communicationService.durationChange({
                    minDuration: this.minDuration,
                    maxDuration: this.maxDuration
                });

                this.optimize(bounds);

                this.globalLoading = false;

                this.dataRetrieved = true;
                this.dataRetrieveEvent.emit(this.dataRetrieveEvent);
            } else {
                this.displayMessage('No flights available! Choose another date.');
                this.router.navigateByUrl('/calendar');
            }
        }, error => {
            this.displayMessage('No flights available!');
            this.router.navigateByUrl('/calendar');
        });

    }

    async optimize(bounds: any[]): Promise<any> {
        const sameFareFamily = [];
        bounds.forEach(bound => {
            bound.rates.forEach(rate => {
                if (!sameFareFamily.includes(rate.fareFamilyContainer.id)) {
                    sameFareFamily.push(rate.fareFamilyContainer.id);
                }
            });
        });

        sameFareFamily.forEach(fareFamily => {
            this.dictionaryService.getDictionaryByFamilyCode(fareFamily).subscribe(res2 => {
                this.fareFamilyDictionary[fareFamily] = res2.data;
            });

        });
        return bounds;
    }

    async sortBounds(sort: any) {

        const sortDirection = sort;

        let boundDeparture = [];
        let boundReturn = [];

        const Departure = 'Departure';
        const Return = 'Return';

        for (let i = 0; i < this.flightBoundMap[Return].length; i++) {
            boundReturn.push(this.flightBoundMap[Return][i]);
        }

        for (let i = 0; i < this.flightBoundMap[Departure].length; i++) {
            boundDeparture.push(this.flightBoundMap[Departure][i]);
        }

        // FOR DEPARTURE

        if (sortDirection.sortBy === 'duration') {
            boundDeparture = boundDeparture.sort((a, b) => {
                return a.duration - b.duration;
            });
        } else if (sortDirection.sortBy === 'departure') {
            boundDeparture.sort((a, b) => {
                return new Date(a.flights[0].details.departure.dateTime).getTime() -
                    new Date(b.flights[0].details.departure.dateTime).getTime();
            });
        } else if (sortDirection.sortBy === 'arrival') {
            boundDeparture.sort((a, b) => {
                return new Date(a.flights[a.flights.length - 1].details.arrival.dateTime).getTime() -
                    new Date(b.flights[b.flights.length - 1].details.arrival.dateTime).getTime();
            });
        } else if (sortDirection.sortBy === 'stops') {
            boundDeparture.sort((a, b) => {
                return a.flights.length - b.flights.length;
            });
        }

        // FOR ARRIVAL

        if (sortDirection.sortBy === 'duration') {
            boundReturn = boundReturn.sort((a, b) => {
                return a.duration - b.duration;
            });
        } else if (sortDirection.sortBy === 'departure') {
            boundReturn.sort((a, b) => {
                return new Date(a.flights[0].details.departure.dateTime).getTime() -
                    new Date(b.flights[0].details.departure.dateTime).getTime();
            });
        } else if (sortDirection.sortBy === 'arrival') {
            boundReturn.sort((a, b) => {
                return new Date(a.flights[a.flights.length - 1].details.arrival.dateTime).getTime() -
                    new Date(b.flights[b.flights.length - 1].details.arrival.dateTime).getTime();
            });
        } else if (sortDirection.sortBy === 'stops') {
            boundReturn.sort((a, b) => {
                return a.flights.length - b.flights.length;
            });
        }

        this.flightBoundMap[Return] = boundReturn;
        this.flightBoundMap[Departure] = boundDeparture;

        return this.flightBoundMap;

    }


    async filterBounds(filter: Filter): Promise<any> {
        this.flightBoundMap = this.initialBoundMap;

        const Departure = 'Departure';
        const Return = 'Return';

        const filteredBoundMap = {};
        filteredBoundMap[Departure] = [];
        filteredBoundMap[Return] = [];

        for (let i = 0; i < this.flightBoundMap[Departure].length; i++) {
            const bound = this.flightBoundMap[Departure][i];

            if (bound.duration && bound.flights && bound.flights.length > 0) {
                // Compare durations
                const durationMatch = bound.duration * 1000 >= filter.durationFrom && bound.duration * 1000 <= filter.durationTo;

                // Compare departures and arrivals
                const departureDate = new Date(bound.flights[0].details.departure.dateTime);
                const arrivalDate = new Date(bound.flights[bound.flights.length - 1].details.arrival.dateTime);

                const departureTime = (departureDate.getHours() * 60 + departureDate.getMinutes()) * 60000 + departureDate.getSeconds() * 1000;
                const arrivalTime = (arrivalDate.getHours() * 60 + arrivalDate.getMinutes()) * 60000 + arrivalDate.getSeconds() * 1000;

                const departureTimeMatch = departureTime >= filter.departureFrom && departureTime <= filter.departureTo;
                const arrivalTimeMatch = arrivalTime >= filter.arrivalFrom && arrivalTime <= filter.arrivalTo;


                // Identify stops
                const stopsMatch = filter.withoutStops ? bound.flights.length > 1 : null;

                if (durationMatch && departureTimeMatch && arrivalTimeMatch && (stopsMatch === false || stopsMatch === null)) {
                    filteredBoundMap[Departure].push(bound);
                }

            }
        }

        for (let i = 0; i < this.flightBoundMap[Return].length; i++) {
            const bound = this.flightBoundMap[Return][i];

            if (bound.duration && bound.flights && bound.flights.length > 0) {
                // Compare durations
                const durationMatch = bound.duration * 1000 >= filter.durationFrom && bound.duration * 1000 <= filter.durationTo;

                // Compare departures and arrivals
                const departureDate = new Date(bound.flights[0].details.departure.dateTime);
                const arrivalDate = new Date(bound.flights[bound.flights.length - 1].details.arrival.dateTime);

                const departureTime = (departureDate.getHours() * 60 + departureDate.getMinutes()) * 60000 + departureDate.getSeconds() * 1000;
                const arrivalTime = (arrivalDate.getHours() * 60 + arrivalDate.getMinutes()) * 60000 + arrivalDate.getSeconds() * 1000;

                const departureTimeMatch = departureTime >= filter.departureFrom && departureTime <= filter.departureTo;
                const arrivalTimeMatch = arrivalTime >= filter.arrivalFrom && arrivalTime <= filter.arrivalTo;

                const stopsMatch = filter.withoutStops ? bound.flights.length > 1 : null;

                if (durationMatch && departureTimeMatch && arrivalTimeMatch && (stopsMatch === false || stopsMatch === null)) {
                    filteredBoundMap[Return].push(bound);
                }

            }
        }

        this.flightBoundMap = filteredBoundMap;
        this.globalLoading = false;

        return this.flightBoundMap;
    }

    expandBound(flightType, index, value) {
        if (!this.openedBoundMap[flightType]) {
            this.openedBoundMap[flightType] = {};
        }
        if (!this.openedBoundMap[flightType][index]) {
            this.openedBoundMap[flightType][index] = {};
        }

        this.openedBoundMap[flightType][index] = value;


    }


    stringify(value): string {
        return JSON.stringify(value);
    }

    millsIntoHours(duration: number): string {
        let result = '';
        let hour = 'h';
        let min = 'm';

        if (this.locale === 'kz') {
            hour = 'с';
            min = 'м';
        } else if (this.locale === 'ru') {
            hour = 'ч';
            min = 'м';
        } else {
            hour = 'h';
            min = 'm';
        }

        const totalMinutes = duration / 60;
        const totalHours = totalMinutes / 60;

        const minutes = Math.floor(totalMinutes) % 60;
        const hours = Math.floor(totalHours) % 60;

        if (hours !== 0) {
            result += hours + hour;

            if (minutes.toString().length === 1) {
                result += ' 0' + minutes + min;
            } else {
                result += ' ' + minutes + min;
            }
        }

        return result;
    }

    createCart(flight: any, offerId: string) {
        const cartRequest = new CartRequest();
        cartRequest.offerId = offerId;

        this.globalLoading = true;
        this.cartService.createCart(cartRequest).subscribe(res => {
            if (res.data) {
                this.cartResponse = res.data;
                const result = {
                    flight,
                    selectedBoundMap: this.selectedBoundMap,
                    cart: this.cartResponse,
                    offerId: cartRequest.offerId
                };

                this.booking = result;
                localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));

                this.selected.emit(result);

                this.communicationService.bookingChange('');

                this.globalLoading = false;
            }
        }, () => {
            this.selectedBoundMap = {};
            this.globalLoading = false;
            this.displayMessage('Возникла ошибка при создании корзины! Попробуте еще раз!');
        });
    }

    changeSelected(rateResult, flight, index) {
        this.selectedBoundMap[flight.type] = rateResult;
        localStorage.removeItem('rate');
        if (this.searchRequest && this.searchRequest.itineraries.length === 1 && this.selectedBoundMap[flight.type]) {
            this.createCart(flight, rateResult.rate.offerIds[0]);
        } else {
            this.communicationService.changeOfferId(rateResult.rate.offerIds);
            if (this.selectedBoundMap['Departure'] && this.selectedBoundMap['Return']) {
                const flightType = flight.type === 'Departure' ? 'Return' : 'Departure';
                const firstBoundRate = rateResult.rate;
                const secondBoundRate = this.selectedBoundMap[flightType].rate;

                let sameOfferId = null;
                let unionFound = false;

                for (let i = 0; i < firstBoundRate.offerIds.length; i++) {
                    const offerId = firstBoundRate.offerIds[i];
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
                    this.createCart(flight, sameOfferId);
                }
            }
        }
        this.typeMap = {};
    }

    displayMessage(text: string): void {
        this._snackBar.open(text, '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }


    durationIntoDays(duration): number {
        return Math.floor(duration / 8640000);
    }

    openDialog(inbound, flight, i, type: string, rate?: any) {
        const matDialogRef = this.dialog.open(DetailsHeaderComponent, {
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            data: {
                type,
                bound: inbound,
                fareFamilyDictionary: this.fareFamilyDictionary,
                chosenRate: rate ? rate : null
            },
        });
        matDialogRef.afterClosed().subscribe(res => {
            if (res) {
                this.changeSelected(res, flight, i);
            }
        });
    }

    countDays(origin: string, destination: string) {
        let diff;
        const departure = new Date(origin);
        const arrival = new Date(destination);
        const depMonth = departure.getMonth();
        const arrMonth = arrival.getMonth();

        if (depMonth === arrMonth) {
            diff = Math.abs(departure.getDate() - arrival.getDate());
            return diff;
        } else {
            const depTime = new Date(departure.getTime());
            depTime.setMonth(departure.getMonth() + 1);
            depTime.setDate(0);
            const daysLeft = depTime.getDate() > depTime.getDate() ? depTime.getDate() - depTime.getDate() : 0;

            diff = daysLeft + arrival.getDate();
            return diff;
        }
    }

    changeBound(flightType: string) {
        this.selectedBoundMap = {};

        localStorage.removeItem('booking');
        localStorage.removeItem('serviceContent');
        localStorage.removeItem('taxInfo');
        localStorage.removeItem('baggageAllowance');

        this.communicationService.bookingChange(null);
    }

    priceView(price: string): string {
        let result = '';
        price = price.split('').reverse().join('');
        for (let i = price.length - 1; i >= 0; i--) {
            result += price.charAt(i);
            if (i !== 0 && i % 3 === 0 && !price.includes(',') && !price.includes('.')) {
                result += ' ';
            }
        }
        return result;

    }

    // priceView2(): string {
    //     let result = '';
    //     let price = '131.150000';
    //     let counter = 1;
    //     price = price.split('').reverse().join('');
    //     for (let i = price.length - 1; i >= 0; i--) {
    //         result += price.charAt(i);
    //         if (price.charAt(i) === '.' || price.charAt(i) === ',') {
    //             counter = 1;
    //             console.log(price.charAt(i));
    //             console.log(i);
    //             continue;
    //         }
    //         counter++;
    //         if (counter !== 0 && (counter + 1) % 3 === 0 && counter < price.length) {
    //             // console.log(counter)
    //             result += ' ';
    //         }
    //         // counter++;
    //     }
    //     console.log(result)
    //     return result;
    //
    // }

    chooseType(type: string, i: number, flightType: string, rate?: any) {
        this.typeMap[flightType] = {};
        this.typeMap[flightType][i] = type;
        this.typeMap[flightType]['rate'] = rate;
        this.rateTest = rate;
        this.check = !this.check;
    }


    getStops(inbound: Bound) {
        const stops = [];
        for (let i = 0; i < inbound.flights.length; i++) {
            if (inbound.flights[i].details.stop) {
                stops.push(inbound.flights[i].details.stop);
            }
        }
        return stops;
    }

    close(flightType: string) {
        this.typeMap[flightType] = null;
    }

}
