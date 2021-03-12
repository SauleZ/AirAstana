import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import icClear from '@iconify/icons-ic/clear';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map} from 'rxjs/operators';
import {CryptoService} from '../../../utils/crypto.service';
import {DictionaryService} from '../../../shared/api/dictionary.service';
import {Subject, Subscription} from 'rxjs';
import {CommunicationService} from '../../../../@vex/services/communication/communication.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {SeatmapService} from '../../../shared/api/seatmap.service';
import {OrderService} from '../../../shared/api/order.service';
import {State} from "../../state";
import {DeviceDetectorService} from "ngx-device-detector";
import {Router} from "@angular/router";

@Component({
    selector: 'vex-booking-modal',
    templateUrl: './booking-modal.component.html',
    styleUrls: ['./booking-modal.component.scss']
})
export class BookingModalComponent implements OnInit {

    public static changeSubject: Subject<any> = new Subject<any>();
    @Output() continueEvent: EventEmitter<any> = new EventEmitter<any>();
    icClear = icClear;
    passengersCount = {};
    baggage: any;
    booking: any;
    locale: string;
    seatResult: any;
    selectedServicesMap = {};
    subscription: Subscription = new Subscription();
    smartTaxesMap: any = {};
    taxInfo: any = {};
    searchRequest: any;
    isMobile = false;
    currency = String;
    assistanceList = [];
    mealList = [];

    serviceContent: any = {};
    cabinType: string;

    globalLoading = false;

    constructor(
        private dialog: MatDialogRef<BookingModalComponent>,
        private _cryptoService: CryptoService,
        private _translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public communicationService: CommunicationService,
        public dictionaryService: DictionaryService,
        private deviceService: DeviceDetectorService,
        private router: Router,
        private seatmapService: SeatmapService,
        private orderService: OrderService,
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.booking = data.booking;
        this.currency = data.currency;
        BookingModalComponent.changeSubject.subscribe(res => {
            this.booking = res;

            if (this.booking.cart && this.booking.cart.offers) {
                this.getTaxesByCode();
            }
        });

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

    close() {
        this.dialog.close();
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

    getBooking() {
        if (localStorage.getItem('booking')) {
            this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
            localStorage.setItem('booking2', JSON.stringify(this.booking));

            if (this.booking && this.booking.order && this.booking.order.air) {
                this.cabinType = this.booking.order.air.bounds[0].flights[0].cabin;
            }

            if (this.booking.order && this.booking.order.services) {
                this.getServices(this.booking.order.services);
            }

            if (this.booking.cart && this.booking.cart.offers) {
                this.getTaxesByCode();
            }
        } else {
            this.booking = null;
        }

        if (localStorage.getItem('serviceContent')) {
            this.serviceContent = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));
        }
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
                            const taxItem = await this.getTaxesByTaxCode(item);
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

    async getTaxesByTaxCode(item: any): Promise<any> {
        return this.dictionaryService.getTaxesByTaxCode(item.code).pipe(map(res => {
            return res.data[0];
        })).toPromise();
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

                delete this.serviceContent[type];
                localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));

                if (type === 'baggage') {
                    delete this.serviceContent['baggageTotal'];
                    localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));

                }

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

    async deleteSeats(seats: any) {
        this.globalLoading = true;
        for (const seat of seats) {
            await this.seatmapService.deleteSpecificSeatFromOrder(this.booking.order.id, seat.id, this.booking.lastName).toPromise();
            // this.seatmapService.deleteSpecificSeatFromOrder(this.booking.order.id, seat.id, this.booking.lastName).subscribe(res => {
            // });
        }
        localStorage.removeItem('seatResult');

        delete this.serviceContent['seatmap'];
        // console.log('this.serviceContent', this.serviceContent);

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
        this.dialog.close();
    }
}
