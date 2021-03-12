import {Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BookingModalComponent} from './booking-modal/booking-modal.component';
import {DeviceDetectorService} from 'ngx-device-detector';
import {State} from '../state';
import {Router} from '@angular/router';
import {Observable, Subject, Subscription} from 'rxjs';
import {IconService} from '../../../@vex/services/icon.service';
import {Cart} from '../../shared/models/cart/cart';
import {CommunicationService} from '../../../@vex/services/communication/communication.service';
import {DictionaryService} from '../../shared/api/dictionary.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {SeatmapService} from '../../shared/api/seatmap.service';
import {OrderService} from '../../shared/api/order.service';
import {CryptoService} from '../../utils/crypto.service';
import {map} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'vex-booking',
    templateUrl: './booking.component.html',
    styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit, OnChanges {

    public static changeSubject: Subject<any> = new Subject<any>();

    @Input() booking: any;
    @Input() service: any;
    @Input() baggageInput: boolean;
    @Output() continueEvent: EventEmitter<any> = new EventEmitter<any>();
    @Output() selected: EventEmitter<any> = new EventEmitter<any>();
    @Output() removeService = new EventEmitter<any>();


    purchase: any = {};
    panelOpenState = false;
    selectedRate: any;
    locale: string;
    selectedBoundMap: any = {};
    seatResult: any;
    isMobile = false;
    isTablet = false;
    flights = false;
    baggage = false;
    meal = false;
    seats = false;
    cart: Cart;
    // filterForm;
    subscription: Subscription = new Subscription();
    taxes: any;
    passengersCount = {};
    selectedServicesMap = {};
    globalLoading = false;
    assistanceList = [];
    mealList = [];

    searchRequest: any;
    taxInfo: any = {};
    serviceContent: any = {};
    smartTaxesMap: any = {};
    cabinType: string;
    data: SafeHtml;
    iAgree = false;
    currency: string;

    constructor(
        private orderService: OrderService,
        private dialog: MatDialog,
        private router: Router,
        private deviceService: DeviceDetectorService,
        private seatmapService: SeatmapService,
        public iconService: IconService,
        public communicationService: CommunicationService,
        public dictionaryService: DictionaryService,
        private _translateService: TranslateService,
        private _cryptoService: CryptoService,
        private sanitizer: DomSanitizer,
        @Inject(DOCUMENT) private document: any
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.iconService = new IconService();

        this.getSearchRequest();

        BookingComponent.changeSubject.subscribe(res => {
            this.booking = res;

            if (this.booking.cart && this.booking.cart.offers) {
                this.getTaxesByCode();
            }
        });

        this.communicationService.serviceChangeObservable$.subscribe(res => {
                this.getServices(res);
            }
        );

    }

    ngOnInit(): void {
        this.locale = this._translateService.currentLang;
        this._translateService.onLangChange
            .subscribe((langChangeEvent: LangChangeEvent) => {
                this.locale = langChangeEvent.lang;
            });

        this.getBooking();

        this.subscription = this.communicationService.bookingChangeObservable$.subscribe(booking => {
            this.mealList = [];
            this.assistanceList = [];

            this.getBooking();
        });

        this.subscription = this.communicationService.seatInfoChangeObservable$.subscribe($event => {
            this.seatResult = $event;
            this.getBooking();
        });
    }

    getSearchRequest() {
        if (localStorage.getItem('searchRequest')) {
            this.searchRequest = this._cryptoService.decryptData(localStorage.getItem('searchRequest'));

            for (const passenger of this.searchRequest.passengers) {
                if (!this.passengersCount[passenger.passengerTypeCode]) {
                    this.passengersCount[passenger.passengerTypeCode] = 0;
                }
                this.passengersCount[passenger.passengerTypeCode] += 1;
            }
        }

    }

    getBooking(booking?) {
        if (localStorage.getItem('booking')) {
            this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
            localStorage.setItem('booking2', JSON.stringify(this.booking));
            if (this.booking && this.booking.cart
                && this.booking.cart.offers && this.booking.cart.offers[0]
                && this.booking.cart.offers[0].costContainer && this.booking.cart.offers[0].costContainer.cost.currencyCode) {
                this.currency = this.booking.cart.offers[0].costContainer && this.booking.cart.offers[0].costContainer.cost.currencyCode;
            }
        } else {
            this.booking = null;
        }

        if (this.booking && this.booking.order && this.booking.order.air) {
            this.cabinType = this.booking.order.air.bounds[0].flights[0].cabin;


            if (this.booking.order && this.booking.order.services) {
                this.getServices(this.booking.order.services);
                if (this.getRouteActive() === '/summary')
                    this.getPurchaseInfo();
            }

        }

        if (this.booking && this.booking.cart && this.booking.cart.offers) {
            this.getTaxesByCode();
        }


        if (localStorage.getItem('serviceContent')) {
            this.serviceContent = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));
        }




    }

    isShown() {
        let result = false;
        if (this.searchRequest) {
            if (this.searchRequest.itineraries.length === 1) {
                if (this.booking && (this.booking.selectedBoundMap['Departure'] || this.booking.selectedBoundMap['Return'])) {
                    result = true;
                }
            } else if (this.searchRequest.itineraries.length === 2) {
                if (this.booking && this.booking.selectedBoundMap['Departure'] && this.booking.selectedBoundMap['Return']) {
                    result = true;
                }
            }
        } else {
            if (this.booking && this.booking.selectedBoundMap['Departure'] && this.booking.selectedBoundMap['Return']) {
                result = true;
            }
        }
        return result;
    }

    getServices(res: any) {
        this.selectedServicesMap = res;

        if ((this.selectedServicesMap['assistance']['hearing'].length > 0) ||
            (this.selectedServicesMap['assistance']['visual'].length > 0) ||
            (this.selectedServicesMap['assistance']['special'].length > 0)) {

            for (let i = 0; i < this.getKeys(this.selectedServicesMap['assistance']).length; i++) {
                const key = this.getKeys(this.selectedServicesMap['assistance'])[i];

                if (this.selectedServicesMap['assistance'][key].length > 0) {
                    for (let j = 0; j < this.selectedServicesMap['assistance'][key].length; j++) {
                        if (!this.assistanceList.includes(this.selectedServicesMap['assistance'][key][j].title)) {
                            this.assistanceList.push(this.selectedServicesMap['assistance'][key][j].title);
                        }

                    }
                }
            }
        }

        if (this.selectedServicesMap['meal']) {
            for (let i = 0; i < this.selectedServicesMap['meal'].length; i++) {

                if (!this.mealList.includes(this.selectedServicesMap['meal'][i].title)) {
                    this.mealList.push(this.selectedServicesMap['meal'][i].title);
                }

            }
        }

    }


    async getTaxesByCode() {
        const offer = this.booking.cart.offers[0];
        const unitCosts = offer.costContainer.unitCosts;
        let taxes = [];
        let taxCodes = [];


        if (localStorage.getItem('taxInfo')) {

            this.taxInfo = this._cryptoService.decryptData(localStorage.getItem('taxInfo'));

            if (this.taxInfo) {
                taxes = this.taxInfo.taxes ? this.taxInfo.taxes : [];
                taxCodes = this.taxInfo.taxCodes ? this.taxInfo.taxCodes : [];
            }
        }

        for (const unitCost of unitCosts) {
            const passengersSize = unitCost.passengers.length;

            for (const passenger of unitCost.passengers) {
                const passengerTypeCode = this.getPassengerTypeCode(passenger.passengerTypeCode);

                if (!this.smartTaxesMap[passengerTypeCode]) {
                    this.smartTaxesMap[passengerTypeCode] = {};
                }
                const tax = unitCost.taxes[0];
                if (tax && tax.taxItems && tax.taxItems.length) {
                    for (const item of tax.taxItems) {
                        if (!taxCodes.includes(item.code)) {
                            const taxItem = await this.getTaxesByTaxCode(item, passengerTypeCode, passengersSize);
                            this.smartTaxesMap[passengerTypeCode][item.code] = {
                                title: taxItem.title,
                                total: item.total,
                                currency: item.currencyCode,
                                passengerCount: passengersSize
                            };
                            taxCodes.push(item.code);
                            taxes.push(taxItem);
                            this.taxInfo = {
                                taxCodes,
                                taxes
                            };
                            localStorage.setItem('taxInfo', this._cryptoService.encryptData(JSON.stringify(this.taxInfo)));
                        } else {
                            for (const taxItem of taxes) {
                                if (taxItem.code === item.code) {
                                    this.smartTaxesMap[passengerTypeCode][item.code] = {
                                        title: taxItem.title,
                                        total: item.total,
                                        currency: item.currencyCode,
                                        passengerCount: passengersSize
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    async getTaxesByTaxCode(item: any, passengerTypeCode: string, passengersSize: number): Promise<any> {
        return this.dictionaryService.getTaxesByTaxCode(item.code).pipe(map(res => {
            return res.data[0];
        })).toPromise();
    }

    getPassengerTypeCode(passengerId): string {
        if (this.booking && this.booking.cart) {
            for (let i = 0; i < this.booking.cart.passengers.length; i++) {
                if (this.booking.cart.passengers[i].personality.id === passengerId) {
                    return this.booking.cart.passengers[i].personality.passengerTypeCode;
                }
            }
        }
    }

    getKeys(object: any) {
        return Object.keys(object);
    }


    calculateTotal(services: any, type: string): number {
        let total = 0;

        if (type === 'seats') {
            for (let i = 0; i < services.length; i++) {
                if (services[i].prices) {
                    total += services[i].prices.totalPrices[0].total.value;
                }
            }
            return total;
        } else if (type === 'baggage') {
            for (let i = 0; i < services.length; i++) {
                if (services[i].prices && services[i].prices.totalPrices) {
                    total += services[i].prices.totalPrices[0].total.value;
                }

            }
            return total;
        } else {
            return 0;
        }
    }

    getTotal(): string {
        if (this.booking && this.booking.selectedBoundMap) {
            const flightTypes = Object.keys(this.booking.selectedBoundMap);
            let total = 0;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < flightTypes.length; i++) {
                if (this.booking.selectedBoundMap[flightTypes[i]].rate) {
                    total += this.booking.selectedBoundMap[flightTypes[i]].rate.cost.total;
                }
            }
            return total.toString();
        } else {
            return '0';
        }
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


    continue() {
        this.globalLoading = true;
        let state = localStorage.getItem('state');

        localStorage.setItem('taxInfo', this._cryptoService.encryptData(this.taxInfo));

        if (!this.booking) {
            state = State.FLIGHT_SELECTED_STATE.toString();
            localStorage.setItem('state', state);
        } else if (this.booking && state === State.FLIGHT_SELECTION_STATE.toString()) {
            state = State.PASSENGER_FULFILL_STATE.toString();
            localStorage.setItem('state', state);

            localStorage.setItem('index', '1');
            if (this.isMobile) {
                this.router.navigateByUrl('/passenger').finally(() => {
                    window.location.reload();
                });
            } else {
                this.router.navigateByUrl('/passenger');
            }
        } else if (state === State.FLIGHT_SELECTED_STATE.toString()) {
            state = State.PASSENGER_FULFILL_STATE.toString();
            localStorage.setItem('state', state);
            localStorage.setItem('index', '1');
            if (this.isMobile) {
                this.router.navigateByUrl('/passenger').finally(() => {
                    window.location.reload();
                });
            } else {
                this.router.navigateByUrl('/passenger');
            }
        } else if (state === State.PASSENGER_FULFILL_STATE.toString()) {
            localStorage.setItem('index', '2');

            if (this.isMobile) {
                this.communicationService.passengerInfoChange('text');
            }

        } else if (state === State.SERVICE_SELECTION_STATE.toString()) {
            // this.communicationService.orderSeatAdditionChange('seat added to order');
            this.communicationService.serviceCreate('add service to order');
            localStorage.setItem('index', '3');
        }

        this.continueEvent.emit(state);

        this.globalLoading = false;
    }

    openBooking() {
        this.dialog.open(BookingModalComponent, {
            width: '100%',
            maxWidth: '100%',
            panelClass: 'padding',
            data: {booking: this.booking, currency: this.currency}
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        let state = localStorage.getItem('state');
        this.selectedRate = null;
        for (const item in changes) {
            if (item === 'booking' && this.booking) {
                state = State.FLIGHT_SELECTED_STATE.toString();
                localStorage.setItem('state', state);
                BookingComponent.changeSubject.next(this.booking);
                this.cart = this.booking.cart;
                localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
                localStorage.setItem('booking2', JSON.stringify(this.booking));
            } else if (item === 'baggage' && this.baggageInput) {
                this.baggage = true;
                localStorage.setItem('baggage', 'true');
            }
        }
    }

    priceView(price: string): string {
        let result = '';
        if (price) {
            price = price.split('').reverse().join('');
            for (let i = price.length - 1; i >= 0; i--) {
                result += price.charAt(i);
                if (i !== 0 && i % 3 === 0 && !price.includes(',') && !price.includes('.')) {
                    result += ' ';
                }
            }
        }
        return result;
    }

    getRouteActive() {
        return this.router.url;
    }

    countDays(origin: string, destination: string) {
        const departure = new Date(origin);
        const arrival = new Date(destination);

        const diff = Math.abs(departure.getDate() - arrival.getDate());
        // this.isExpanded = true;
        return diff;

    }

    getPassengerType(passenger: string, passengersCountElement: number): string {
        switch (true) {
            case passengersCountElement === 1 && passenger === 'ADT' :
                return 'ADULT';
            case passenger === 'ADT' && passengersCountElement > 1 :
                return 'ADULTS';
            case passenger === 'CHD' && passengersCountElement === 1 :
                return 'CHILD';
            case passenger === 'CHD' && passengersCountElement > 1 :
                return 'CHILDREN';
            case passenger === 'INF' && passengersCountElement === 1 :
                return 'INFANT';
            case passenger === 'INF' && passengersCountElement > 1 :
                return 'INFANTS';
        }
        // return '';
    }

    deleteService(selectedServicesMap: any, type: string, event: any) {
        event.stopPropagation();

        this.globalLoading = true;
        let serviceIds = '';

        if (selectedServicesMap !== this.selectedServicesMap['assistance']) {
            if (selectedServicesMap === this.selectedServicesMap['meal']) {
                this.mealList = [];
            }

            for (const item of selectedServicesMap) {

                if (!serviceIds) {
                    serviceIds += item.serviceId;
                } else {
                    serviceIds += ',' + item.serviceId;
                }
            }

            this.deleteServiceAndUpdateOrder(serviceIds, type);

        } else {
            this.assistanceList = [];
            for (let i = 0; i < this.getKeys(selectedServicesMap).length; i++) {
                const key = this.getKeys(selectedServicesMap)[i];
                for (const item of selectedServicesMap[key]) {
                    if (!serviceIds) {
                        serviceIds += item.serviceId;
                    } else {
                        serviceIds += ',' + item.serviceId;
                    }
                }
            }
            this.deleteServiceAndUpdateOrder(serviceIds, type);

        }
    }

    deleteServiceAndUpdateOrder(serviceIds, type) {

        this.seatmapService.deleteServiceByIds(this.booking.order.id, serviceIds, this.booking.lastName).subscribe(res => {
            this.orderService.getOrder(this.booking.order.id, this.booking.lastName).subscribe(order => {
                this.booking.order = order.data;
                this.globalLoading = false;

                // console.log('type ' + type)

                delete this.serviceContent[type];

                localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));
                localStorage.setItem('serviceContent2', JSON.stringify(this.serviceContent));

                if (type === 'baggage') {
                    delete this.serviceContent['baggageTotal'];
                    localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));
                    localStorage.setItem('serviceContent2', JSON.stringify(this.serviceContent));

                }
                // console.log('serviceContent ')
                // console.log(this.serviceContent)

                if (this.serviceContent.length === 0) {
                    localStorage.removeItem('serviceContent');
                    localStorage.removeItem('serviceContent2');
                }
                // console.log('serviceContent ')
                // console.log(this.serviceContent)

                localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
                localStorage.setItem('booking2', JSON.stringify(this.booking));
                if (this.booking.order && this.booking.order.services) {
                    this.getServices(this.booking.order.services);
                    // this.selectedServicesMap = this.booking.order.services;
                    this.communicationService.bookingChange(this.booking);
                }
            });

        });
    }

    async deleteSeats(seats: any) {
        this.globalLoading = true;
        for (const seat of seats) {
            await this.seatmapService.deleteSpecificSeatFromOrder(this.booking.order.id, seat.id, this.booking.lastName).toPromise();
        }
        localStorage.removeItem('seatResult');

        // window.location.reload();
        delete this.serviceContent['seatmap'];

        localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));
        localStorage.setItem('serviceContent2', JSON.stringify(this.serviceContent));

        this.orderService.getOrder(this.booking.order.id, this.booking.lastName).subscribe(order => {
            this.booking.order = order.data;
            this.globalLoading = false;
            localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
            localStorage.setItem('booking2', JSON.stringify(this.booking));
            this.communicationService.bookingChange(this.booking);
        });
    }

    checkPassengerSeat(unitPrices: any[], travelerId): boolean {
        let existPassenger = false;
        unitPrices.forEach(unitPrice => {
            if (unitPrice && unitPrice.travelerIds[0] === travelerId) {
                existPassenger = true;
                return;
            }
        });
        return existPassenger;
    }

    showBaggage(): boolean {
        const bookingExist = this.booking && this.booking.order && this.booking.order.services;
        const hasBaggage = this.selectedServicesMap['baggage'] && this.selectedServicesMap['baggage'].length > 0;

        return bookingExist && hasBaggage;
    }

    showMeal(): boolean {
        const bookingExist = this.booking && this.booking.order && this.booking.order.services;
        const hasMeal = this.selectedServicesMap['meal'] && this.selectedServicesMap['meal'].length > 0;

        return bookingExist && hasMeal;
    }

    showAssistance(): boolean {
        if (this.selectedServicesMap['assistance']) {
            const bookingExist = this.booking && this.booking.order && this.booking.order.services;
            const hasVisual = this.selectedServicesMap['assistance'] && this.selectedServicesMap['assistance']['visual'] && this.selectedServicesMap['assistance']['visual'].length > 0;
            const hasHearing = this.selectedServicesMap['assistance']['hearing'] && this.selectedServicesMap['assistance']['hearing'].length > 0;
            const hasSpecial = this.selectedServicesMap['assistance']['special'] && this.selectedServicesMap['assistance']['special'].length > 0;

            return bookingExist && (hasVisual || hasHearing || hasSpecial);
        }
        return false;
    }

    redirectToPayment() {
        document.getElementById('redirect').click();
    }

    getPurchaseInfo() {
        this.orderService.getPurchaseInfo(this.booking.order.id, this.booking.lastName).subscribe(res => {
            if (res.data) {
                const data = res.data;
                this.purchase.url = data.url;
                this.purchase.method = data.method;
                this.purchase.data = [];

                const arr: any[] = Object.keys(data.data);
                arr.forEach(a => {
                    const obj = {
                        name: a,
                        value: data.data[a]
                    };
                    this.purchase.data.push(obj);
                });
                // this.createPayment(res);
            }
        });

    }

    createPayment(res) {
        this.orderService.createPayment(res.data.url, res.data.data).subscribe(res2 => {
            window.location.href = res.data.url;
        }, error => {

            if (error instanceof HttpErrorResponse && (error.status === 200 || error.status === 302)) {
                window.location.href = error.url;
            }
        });
    }

    showPayNow() {
        this.iAgree = !this.iAgree;
    }
}
