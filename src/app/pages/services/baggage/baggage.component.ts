import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {LayoutService} from '../../../../@vex/services/layout.service';
import {SidebarComponent} from '../../../../@vex/components/sidebar/sidebar.component';
import {MatSidenav} from '@angular/material/sidenav';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialogRef} from '@angular/material/dialog';
import {IconService} from '../../../../@vex/services/icon.service';
import {SeatmapService} from '../../../shared/api/seatmap.service';
import {CommunicationService} from '../../../../@vex/services/communication/communication.service';
import {CryptoService} from '../../../utils/crypto.service';
import {OrderService} from '../../../shared/api/order.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';

@Component({
    selector: 'vex-baggage',
    templateUrl: './baggage.component.html',
    styleUrls: ['./baggage.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BaggageComponent implements OnInit {

    @Input() pasOneBag = 0;
    @Input() pasTwoBag = 0;
    @ViewChild('sidenav') sidenav: MatSidenav;
    @ViewChild('configpanel', {static: true}) configpanel: SidebarComponent;
    @Output() close = new EventEmitter<any>();

    total = 0;

    isMobile = false;
    isDesktop = false;
    isTablet = false;
    screenHeight: number;
    screenWidth: number;
    booking: any;
    selectedServiceMap: any = {};
    globalLoading = true;
    services: any = {};
    flightServices: any = {};
    result: any;
    editResult: any;
    request: any[] = [];
    exist = false;
    cabinType: string;
    baggageAllowance: string;
    handLuggage: string;

    serviceContent: any = {};
    serviceContentFirst: any = {};
    servicesTotal: any = {};

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    dataChanged = false;
    searchRequest: any;
    currency;

    availableIds = new Set();
    serviceAvailablePassengers: any = [];

    constructor(
        private layoutService: LayoutService,
        private deviceService: DeviceDetectorService,
        public _iconService: IconService,
        private dialog: MatDialogRef<BaggageComponent>,
        private communicationService: CommunicationService,
        private extraBaggageService: SeatmapService,
        private _cryptoService: CryptoService,
        private orderService: OrderService,
        private seatmapService: SeatmapService,
        private _snackBar: MatSnackBar
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;

        if (localStorage.getItem('searchRequest')) {
            this.searchRequest = this._cryptoService.decryptData(localStorage.getItem('searchRequest'));
        }
    }

    ngOnInit(): void {
        this.globalLoading = true;

        if (localStorage.getItem('booking')) {
            this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
            this.cabinType = this.booking.order.air.bounds[0].flights[0].cabin;
        }

        if (localStorage.getItem('baggageAllowance')) {
            this.baggageAllowance = this._cryptoService.decryptData(localStorage.getItem('baggageAllowance'));
            if (!this.baggageAllowance.includes('0PC') || !this.baggageAllowance.includes('0pc') || !this.baggageAllowance.includes('0 PC') || !this.baggageAllowance.includes('0 pc')) {
                const aster = this.baggageAllowance.includes('*');
                let indx = '/';
                if (aster) {
                    indx = '*';
                } else {
                    indx = '/';
                }
                this.baggageAllowance = this.baggageAllowance.substring(this.baggageAllowance.indexOf(indx) + 1, this.baggageAllowance.length)
            } else {
                this.baggageAllowance = '';
            }
        }
        if (localStorage.getItem('handLuggage')) {
            this.handLuggage = this._cryptoService.decryptData(localStorage.getItem('handLuggage'));
            if (!this.handLuggage.includes('0PC') || !this.handLuggage.includes('0pc') || !this.handLuggage.includes('0 PC') || !this.handLuggage.includes('0 pc')) {
                this.handLuggage = this.handLuggage.replace('*', ' x ').replace('kg', ' KG').replace('pc', '').replace('PC', '');
            } else {
                this.handLuggage = '';
            }
            const aster = this.handLuggage.includes('*');
            let indx = '/';
            if (aster) {
                indx = '*';
            } else {
                indx = '/';
            }
            this.handLuggage = this.handLuggage.substring(this.handLuggage.indexOf(indx) + 1, this.handLuggage.length)
        }


        this.whenServiceRetrieved();
    }

    formSelectedServiceMap(): void {
        this.globalLoading = true;

        this.selectedServiceMap['Departure'] = [];
        if (this.searchRequest && this.searchRequest.itineraries.length > 1) {
            this.selectedServiceMap['Return'] = [];
        }

        if (this.booking.order) {
            const selectedDepartureBound = this.booking.selectedBoundMap['Departure'].bound;
            let selectedReturnBound;
            if (this.booking.selectedBoundMap['Return'])
                selectedReturnBound = this.booking.selectedBoundMap['Return'].bound;
            for (let i = 0; i < this.booking.order.air.bounds.length; i++) {

                const orderBound = this.booking.order.air.bounds[i];
                const flightsDep = [];

                for (let j = 0; j < selectedDepartureBound.flights.length; j++) {
                    for (let k = 0; k < orderBound.flights.length; k++) {

                        if (this.theSameFlight(orderBound.flights[k], selectedDepartureBound.flights[j])) {
                            const flightbody: any = {};
                            flightbody.flightIds = orderBound.flights[k].id;
                            flightbody.main = selectedDepartureBound.flights[j];
                            flightsDep.push(flightbody);
                        }


                    }
                }


                const names = new Set();
                const namesReturn = new Set();

                for (let l = 0; l < flightsDep.length; l++) {
                    names.add(flightsDep[l].main.details.departure.cityName);
                    names.add(flightsDep[l].main.details.arrival.cityName);
                    const mapBody: any = {};
                    mapBody.flights = flightsDep;
                    mapBody.names = names;
                    this.selectedServiceMap['Departure'] = mapBody;
                }

                // console.log('this.selectedServiceMap')
                // console.log(this.selectedServiceMap)


                const flightsRet = [];
                if (selectedReturnBound) {
                    for (let j = 0; j < selectedReturnBound.flights.length; j++) {
                        for (let k = 0; k < orderBound.flights.length; k++) {

                            if (this.theSameFlight(orderBound.flights[k], selectedReturnBound.flights[j])) {
                                if (!flightsRet.includes(selectedReturnBound.flights[j])) {
                                    const flightbody: any = {};
                                    flightbody.flightIds = orderBound.flights[k].id;
                                    flightbody.main = selectedReturnBound.flights[j];
                                    flightsRet.push(flightbody);
                                }
                            }

                        }
                    }
                    for (let l = 0; l < flightsRet.length; l++) {
                        namesReturn.add(flightsRet[l].main.details.departure.cityName);
                        namesReturn.add(flightsRet[l].main.details.arrival.cityName);
                        const mapBodyReturn: any = {};
                        mapBodyReturn.flights = flightsRet;
                        mapBodyReturn.names = namesReturn;
                        this.selectedServiceMap['Return'] = mapBodyReturn;
                    }
                }
                this.globalLoading = false;
            }
        }


    }

    theSameFlight(flight: any, selectedFlight: any): boolean {
        if (flight.arrival === selectedFlight.details.arrival.cityCode &&
            flight.departure === selectedFlight.details.departure.cityCode) {
            return true;
        }
        return false;
    }

    whenServiceRetrieved(): void {
        this.globalLoading = true;

        this.communicationService.serviceBaggageObservable$.subscribe(value => {

            this.services = value.object;
            this.booking = value.booking;
            // console.log('services');
            // console.log(this.services);
            this.cabinType = this.booking.order.air.bounds[0].flights[0].cabin;

            if (this.booking) {
                this.formSelectedServiceMap();
            }

            this.request = [];

            this.total = 0;

            if (localStorage.getItem('serviceContent')) {
                this.serviceContent = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));

                if (this.serviceContent['baggageTotal']) {
                    this.servicesTotal = this.serviceContent['baggageTotal'];

                    if (this.servicesTotal['baggage']) {
                        this.total = this.servicesTotal['baggage'];
                    }
                }

                if (this.serviceContent['baggage']) {
                    this.serviceContentFirst = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));
                    this.result = this.serviceContent['baggage'];
                    this.editResult = this.result;
                } else {
                    this.result = null;
                }
            }

            if (!this.result) {
                this.result = {};
                if (!this.result['Departure']) {
                    this.result['Departure'] = {};
                }

                if (this.searchRequest && this.searchRequest.itineraries.length > 1) {
                    if (!this.result['Return']) {
                        this.result['Return'] = {};
                    }
                }
            }

            if (value.code === 'baggage') {

                this.services = value.object;
                this.flightServices = {};

                for (let l = 0; l < this.services.length; l++) {
                    // console.log('this.services[l]');
                    // console.log(this.services[l]);
                    // for (let j = 0; j < this.services[i].flightIds.length; j++) {

                    if (!this.flightServices[this.services[l].serviceId]) {
                        // console.log('exist');

                        this.flightServices[this.services[l].serviceId] = [];
                    }
                    // console.log(this.services[l].serviceId);
                    this.flightServices[this.services[l].serviceId].push(this.services[l]);


                }

                // console.log('this.flightServices');
                // console.log(this.flightServices);

                this.currency = this.flightServices[this.services[0].serviceId][0].prices.unitPrices[0].prices[0].total.currencyCode;
                this.baggageServiceAvailableIds();
                this.globalLoading = false;
            }
        });
        this.globalLoading = false;

    }

    formResult(obj, passengerId): any {
        const result: any = {};
        result.serviceId = obj.serviceId;
        result.quantity = obj.quantity;
        result.travelerId = passengerId;
        return result;
    }

    addWeight1(flightType: string, passengerId: string, serviceId: any, flights: any) {

        serviceId = this.getServiceId(passengerId, flights);

        if (!this.result[flightType][serviceId]) {
            this.result[flightType][serviceId] = {};
            // console.log('this.flightServices');
            // console.log(this.flightServices);
            this.result[flightType][serviceId][passengerId] = this.formResult(this.flightServices[serviceId][0], passengerId);
            if (this.result[flightType][serviceId][passengerId].quantity === 10) {
                this.displayMessage('Baggage amount should not exceed 10 items');
            } else {
                this.result[flightType][serviceId][passengerId].quantity++;

                this.isDataChanged(flightType, serviceId, passengerId);
                // console.log('serviceId')
                // console.log(serviceId)

                for (const l of this.serviceAvailablePassengers) {
                    if (flightType === 'Departure' && passengerId === l.id) {
                        this.total += l.priceForBaggage[0].value;
                    } else if (flightType === 'Return' && passengerId === l.id) {
                        this.total += l.priceForBaggage[1].value;
                    }
                }

            }
        } else {
            // console.log('if 2')

            if (!this.result[flightType][serviceId][passengerId]) {
                // console.log('if 3')

                this.result[flightType][serviceId][passengerId] = this.formResult(this.flightServices[serviceId][0], passengerId);
                if (this.result[flightType][serviceId][passengerId].quantity === 10) {
                    this.displayMessage('Baggage amount should not exceed 10 items');
                } else {
                    this.result[flightType][serviceId][passengerId].quantity++;
                    this.isDataChanged(flightType, serviceId, passengerId);
                    // console.log('serviceId')
                    // console.log(serviceId)

                    for (const l of this.serviceAvailablePassengers) {
                        if (flightType === 'Departure' && passengerId === l.id) {
                            this.total += l.priceForBaggage[0].value;
                        } else if (flightType === 'Return' && passengerId === l.id) {
                            this.total += l.priceForBaggage[1].value;
                        }
                    }

                }
            } else {
                // console.log('if 4')

                if (this.result[flightType][serviceId][passengerId].quantity === 10) {
                    this.displayMessage('Baggage amount should not exceed 10 items');
                } else {
                    this.result[flightType][serviceId][passengerId].quantity++;
                    this.isDataChanged(flightType, serviceId, passengerId);

                    for (const l of this.serviceAvailablePassengers) {
                        if (flightType === 'Departure' && passengerId === l.id) {
                            this.total += l.priceForBaggage[0].value;
                        } else if (flightType === 'Return' && passengerId === l.id) {
                            this.total += l.priceForBaggage[1].value;
                        }
                    }
                }
            }
        }
        // console.log('if 55')
        // console.log(this.result)

        this.servicesTotal['baggage'] = this.total;
    }

    getServiceId(passengerId: string, flights) {
        for (let i = 0; i < flights.length; i++) {
            for (let j = 0; j < this.services.length; j++) {
                if (this.services[j].flightIds.includes(flights[i].flightIds) && this.services[j].travelerIds.includes(passengerId)) {
                    // console.log(' rettttttttttttttttttttttttttttturned')
                    // console.log(this.services[j].serviceId)
                    return this.services[j].serviceId;
                }
            }
        }
    }

    isDataChanged(flightType, serviceId, passengerId): boolean {
        if (this.serviceContentFirst && this.serviceContentFirst['baggage']) {
            const resultQuantity = this.result[flightType][serviceId][passengerId].quantity;

            if (this.serviceContentFirst['baggage'][flightType][serviceId] && this.serviceContentFirst['baggage'][flightType][serviceId][passengerId]) {
                const editResultQuantity = this.serviceContentFirst['baggage'][flightType][serviceId][passengerId].quantity;
                this.dataChanged = editResultQuantity !== resultQuantity;
            } else {
                this.dataChanged = true;
            }
        }

        return this.dataChanged;
    }

    displayMessage(text: string): void {
        this._snackBar.open(text, '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    minusWeight1(flightType: string, passengerId: string, serviceId: any, flights: any) {

        serviceId = this.getServiceId(passengerId, flights);

        if (!this.result[flightType][serviceId]) {
            this.result[flightType][serviceId] = {};
            this.result[flightType][serviceId][passengerId] = this.formResult(this.flightServices[serviceId][0], passengerId);
            this.result[flightType][serviceId][passengerId].quantity--;
            this.isDataChanged(flightType, serviceId, passengerId);

        } else {
            if (!this.result[flightType][serviceId][passengerId]) {
                this.result[flightType][serviceId][passengerId] = this.formResult(this.flightServices[serviceId][0], passengerId);
                this.result[flightType][serviceId][passengerId].quantity--;
                this.isDataChanged(flightType, serviceId, passengerId);

            } else {
                this.result[flightType][serviceId][passengerId].quantity--;
                this.isDataChanged(flightType, serviceId, passengerId);

            }
        }

        for (const l of this.serviceAvailablePassengers) {
            if (flightType === 'Departure' && passengerId === l.id && this.total !== 0) {
                this.total -= l.priceForBaggage[0].value;
            } else if (flightType === 'Return' && passengerId === l.id && this.total !== 0) {
                this.total -= l.priceForBaggage[1].value;
            }
        }

        // const unitPrices = this.flightServices[serviceId][0].prices.unitPrices;
        // if (unitPrices) {
        //     for (let l = 0; l < unitPrices.length; l++) {
        //         if (unitPrices[l].travelerIds.includes(passengerId) && this.total !== 0) {
        //             this.total -= unitPrices[l].prices[0].total.value;
        //         }
        //     }
        // }

        this.servicesTotal['baggage'] = this.total;


    }

    async formRequest() {

        // console.log('checking result');
        // console.log(this.result);

        const flightTypes = Object.keys(this.result);

        for (let l = 0; l < flightTypes.length; l++) {
            // console.log('flightType ' + flightTypes[l]);

            const serviceIds = Object.keys(this.result[flightTypes[l]]);
            for (let j = 0; j < serviceIds.length; j++) {
                // console.log('serviceIds ' + serviceIds[j]);


                const passengerIds = Object.keys(this.result[flightTypes[l]][serviceIds[j]]);

                for (let k = 0; k < passengerIds.length; k++) {
                    // console.log('passengerIds ' + passengerIds[k]);


                    if (this.result[flightTypes[l]][serviceIds[j]][passengerIds[k]].quantity !== 0) {


                        this.request.push(this.result[flightTypes[l]][serviceIds[j]][passengerIds[k]]);

                    }

                }
            }
        }
        // console.log('------');


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

    async closeClick(text: string) {
        if (text && text === 'cancel') {
            this.close.emit();
        } else {
            this.formRequest();

            const service: any = {};
            service['baggage'] = this.request;
            this.globalLoading = true;
            // console.log('checking');
            // console.log(this.request);

            if (this.serviceContent && this.serviceContent['baggage']) {

                if (this.dataChanged) {

                    if (localStorage.getItem('booking')) {
                        this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
                        localStorage.setItem('booking2', JSON.stringify(this.booking));
                    }

                    this.deleteService(service);
                } else {
                    this.close.emit();
                }
            } else {
                this.addServiceToOrder(service);
            }

        }


    }


    addServiceToOrder(service) {


        this.seatmapService.addServiceToOrder(this.booking.order.id, service, this.booking.lastName).subscribe(res => {

            this.orderService.getOrder(this.booking.order.id, this.booking.lastName).subscribe((response: any) => {
                this.serviceContent['baggage'] = this.result;
                this.serviceContent['baggageTotal'] = this.servicesTotal;
                localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));
                localStorage.setItem('serviceContent2', JSON.stringify(this.serviceContent));

                this.booking.order = response.data;


                localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
                localStorage.setItem('booking2', JSON.stringify(this.booking));

                this.communicationService.bookingChange(this.booking);
                // this.communicationService.serviceChangeBooking(this.booking.order.services);

                this.close.emit({request: this.request, total: this.total});
                this.globalLoading = false;
            });

        });

    }

    deleteService(service) {
        this.globalLoading = true;
        let serviceIds = '';
        for (const item of this.booking.order.services['baggage']) {

            if (!serviceIds) {
                serviceIds += item.serviceId;
            } else {
                serviceIds += ',' + item.serviceId;
            }
        }

        if (serviceIds && serviceIds !== '')
            this.seatmapService.deleteServiceByIds(this.booking.order.id, serviceIds, this.booking.lastName).subscribe(res => {
                this.addServiceToOrder(service);
            });
        if (service)
            this.addServiceToOrder(service);

    }

    checkSameResult(): boolean {
        let resultString = '';
        let contentServiceFirstString = '';

        const flightTypes = Object.keys(this.result);
        for (let i = 0; i < flightTypes.length; i++) {
            const flightIds = Object.keys(this.result[flightTypes[i]]);
            for (let j = 0; j < flightIds.length; j++) {
                const passengerIds = Object.keys(this.result[flightTypes[i]][flightIds[j]]);
                for (let k = 0; k < passengerIds.length; k++) {
                    resultString += '' + this.result[flightTypes[i]][flightIds[j]][passengerIds[k]];
                    contentServiceFirstString += '' + this.serviceContentFirst['baggage'][flightTypes[i]][flightIds[j]][passengerIds[k]]
                }
            }
        }
        //

        return resultString === contentServiceFirstString;

    }

    // NEWWWWWWWWWWWWWW

    getUnitPrice(prices: any, passengerId: string) {
        for (let i = 0; i < prices.unitPrices.length; i++) {
            if (prices.unitPrices[i].travelerIds.includes(passengerId)) {
                return prices.unitPrices[i].prices[0].total;
            }
        }

    }

    baggageServiceAvailableIds() {
        for (const serviceItem of this.services) {
            for (const u of serviceItem.travelerIds) {
                this.availableIds.add(u);
            }
        }


        this.serviceAvailablePassengers = this.createServiceAvailablePassengers();


        // console.log('availableIds--------------------');
        // console.log(this.availableIds);
        // console.log(this.serviceAvailablePassengers);

        // console.log('this.serviceAvailablePassengers');
        // console.log(this.serviceAvailablePassengers);
    }

    // if flightIds are equal to Departure, then tempObj['priceForBaggage']['Dep'], else tempObj['priceForBaggage']['Ret']

    createServiceAvailablePassengers() {
        let temp: any = [];
        for (const passenger of this.booking.order.passengers) {
            if (this.availableIds.has(passenger.id)) {
                const tempObj = {};
                tempObj['id'] = passenger.id;
                tempObj['name'] = passenger.names[0].firstName + ' ' + passenger.names[0].lastName;
                // let i = 0;
                tempObj['priceForBaggage'] = [];
                for (const serviceItem of this.services) {
                    let p = this.getUnitPrice(serviceItem.prices, passenger.id);
                    if (p) {
                        tempObj['priceForBaggage'].push(p);
                    } // serviceItem.prices.unitPrices[0].prices[0].total
                    // ++i;
                }
                temp.push(tempObj);
                // this.serviceAvailablePassengers.push(tempObj);
            }
        }
        return temp;
    }


}
