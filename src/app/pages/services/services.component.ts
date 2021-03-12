import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {SidebarComponent} from '../../../@vex/components/sidebar/sidebar.component';
import {DOCUMENT} from '@angular/common';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatDialog} from '@angular/material/dialog';
import {IconService} from '../../../@vex/services/icon.service';
import {Subject} from 'rxjs';
import {OrderService} from '../../shared/api/order.service';
import {CommunicationService} from '../../../@vex/services/communication/communication.service';
import {Router} from '@angular/router';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {SeatmapService} from '../../shared/api/seatmap.service';
import {State} from '../state';
import {CryptoService} from '../../utils/crypto.service';
import {SpecialAssistanceComponent} from "./special-assistance/special-assistance.component";

@Component({
    selector: 'vex-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit, OnDestroy {

    @Output() selected: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('sidenav') sidenav: MatSidenav;
    @ViewChild('baggage', {static: true}) baggage: SidebarComponent;
    // @ViewChild('configpanel3', {static: true}) configpanel3: SidebarComponent;
    @ViewChild('seatmap', {static: true}) seatmap: SidebarComponent;
    @ViewChild('specialmeals', {static: true}) specialmeals: SidebarComponent;
    @ViewChild('specialassistance', {static: true}) specialassistance: SidebarComponent;

    isMobile = false;
    isDesktop = false;
    isTablet = false;
    reason = '';
    selectedServicesMap: any = {};
    globalLoading = true;
    services: any;

    booking: any;
    filterForm: any;
    servicesRetrieved = false;
    public _opened: boolean;
    private _unsubscribeAll: Subject<any>;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    total: any = {};

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private matDialog: MatDialog,
        private orderService: OrderService,
        private deviceService: DeviceDetectorService,
        private communicationService: CommunicationService,
        private seatmapService: SeatmapService,
        public _iconService: IconService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private _cryptoService: CryptoService
    ) {


        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();

        if (localStorage.getItem('state')) {
            localStorage.setItem('state', State.SERVICE_SELECTION_STATE.toString());
        }

        if (localStorage.getItem('booking')) {
            this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
            this.getOrder();
            if (this.booking.cart && !this.booking.order) {
                this.displayMessage('You didn\'t fill passenger information!');
                this.router.navigateByUrl('/passenger');
            } else if (!this.booking.cart && !this.booking.order) {
                this.displayMessage('You didn\'t select any flights!');
                this.router.navigateByUrl('/');
            }
        } else {
            this.displayMessage('You didn\'t select any flights!');
            this.router.navigateByUrl('/');
        }

        if (localStorage.getItem('filterForm')) {
            this.filterForm = this._cryptoService.decryptData(localStorage.getItem('filterForm'));
        }

        this._unsubscribeAll = new Subject<any>();
    }

    ngOnInit(): void {
        this.communicationService.bookingChangeObservable$.subscribe(booking => {
            this.booking = booking;
            this.checkBookingServices();
        });

        this.communicationService.serviceCreateEventObservable$.subscribe($event => {
            this.router.navigateByUrl('/summary');
        });

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    get opened() {
        return this._opened;
    }

    @Input() set opened(opened: boolean) {
        this._opened = opened;
        opened ? this.enableScrollblock() : this.disableScrollblock();
    }

    enableScrollblock() {
        if (!this.document.body.classList.contains('vex-scrollblock')) {
            this.document.body.classList.add('vex-scrollblock');
        }
    }

    getOrder() {
        this.globalLoading = true;
        this.orderService.getOrder(this.booking.order.id, this.booking.lastName).subscribe(order => {
            this.booking.order = order.data;
            this.getServices();
            this.checkBookingServices();
            localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
            localStorage.setItem('booking2', JSON.stringify(this.booking));
        });
    }

    getServices() {
        this.seatmapService.getService(this.booking.order.id, this.booking.lastName).subscribe(res => {
            this.services = res.data;
            this.globalLoading = false;
            this.servicesRetrieved = true;
        });
    }

    disableScrollblock() {
        if (this.document.body.classList.contains('vex-scrollblock')) {
            this.document.body.classList.remove('vex-scrollblock');
        }
    }

    close(reason: string) {
        this.reason = reason;
        this.sidenav.close();
    }

    open() {
        this.opened = true;
    }

    checkBookingServices() {
        if (this.booking && this.booking.order && this.booking.order.services) {
            this.selectedServicesMap = this.booking.order.services;
        }

    }

    openSideNav(service: string): void {
        if (this.servicesRetrieved) {
            if (service === 'extraBaggage') {
                this.communicationService.serviceBaggageChange({object: this.services['baggage'], code: 'baggage', booking: this.booking});
                if (this.services['baggage']) {
                    this.baggage.open();
                }
            } else if (service === 'specialMeals') {
                this.communicationService.serviceMealsChange({object: this.services['meal'], code: 'meal', booking: this.booking});
                if (this.services['meal']) {
                    this.specialmeals.open();
                }

            } else if (service === 'specialAssistance') {
                this.communicationService.serviceAssistanceChange({object: this.services['assistance'], code: 'assistance', booking: this.booking});
                if (this.services['assistance']) {
                    this.specialassistance.open();
                }
            }
        } else {
            this.displayMessage('Service not retrieved');
        }


    }

    openSideNav2(service: string): void {
        if (this.isMobile) {
            if (this.servicesRetrieved) {
                if (service === 'extraBaggage') {
                    this.communicationService.serviceBaggageChange({object: this.services['baggage'], code: 'baggage', booking: this.booking});
                    if (this.services['baggage']) {
                        this.baggage.open();
                    }
                } else if (service === 'specialMeals') {
                    this.communicationService.serviceMealsChange({object: this.services['meal'], code: 'meal', booking: this.booking});
                    if (this.services['meal']) {
                        this.specialmeals.open();
                    }

                } else if (service === 'specialAssistance') {
                    this.communicationService.serviceAssistanceChange({object: this.services['assistance'], code: 'assistance', booking: this.booking});
                    if (this.services['assistance']) {
                        this.specialassistance.open();
                    }
                }
            } else {
                this.displayMessage('Service not retrieved');
            }
        }


    }

    changeSelected($event): void {
        localStorage.setItem('baggage', 'true');
        if ($event) {
            this.selected.emit(true);
        }
    }

    // openSeatReservation(flight: any, i: number): void {
    //     this.communicationService.seatSelectBtnClicked({flight, requestBody: this.requestBody, index: i}).then(res => {
    //         this.configpanel3.open();
    //     });
    // }

    openSeatReservation(flight: any): void {
        this.communicationService.seatSelectBtnClicked(flight).then(res => {
            this.seatmap.open();
        });
    }

    openSeatReservation2(flight: any): void {
        if(this.isMobile) {
            this.communicationService.seatSelectBtnClicked(flight).then(res => {
                this.seatmap.open();
            });
        }
    }

    getKeys(obj): any[] {
        return Object.keys(obj);
    }

    checkCityNames(seat: any, flight: any): boolean {
        return seat.departureCode.toString().toLowerCase() === flight.details.departure.cityCode.toLowerCase()
            && seat.arrivalCode.toString().toLowerCase() === flight.details.arrival.cityCode.toLowerCase();
    }

    // closeSideNav3($event) {
    //     if ($event) {
    //         this.total[$event.flight.item.id] = $event.total;
    //         this.requestBody = $event.requestBody;
    //         this.passengersSeatsMap = $event.passengersSeatsMap;
    //         this.flightSeatsInfo = $event.flightSeatsInfo;
    //         this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
    //         this.communicationService.seatInfoChange($event);
    //         this.configpanel3.close();
    //     } else {
    //         this.configpanel3.close();
    //     }
    // }

    closeSeatmap($event) {
        if ($event) {
            this.booking = $event;
            this.communicationService.seatInfoChange($event);
            this.seatmap.close();
        } else {
            this.seatmap.close();
        }
    }

    closeSpecialMeals($event) {
        if ($event && $event.length !== 0) {
            this.selectedServicesMap['meal'] = $event;
        }

        this.specialmeals.close();
    }

    closeSpecialAssistance($event) {
        if ($event && $event.length !== 0) {
            this.selectedServicesMap['assistance'] = $event;
        }
        this.specialassistance.close();

    }

    closeExtraBaggage($event) {
        if ($event && $event.length !== 0) {
            this.selectedServicesMap['baggage'] = $event.request;
            // this.getOrder();
            this.total['baggage'] = $event.total;
            // this.createService('baggage');
        }
        this.baggage.close();
    }

    displayMessage(text: string): void {
        this._snackBar.open(text, '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    editService(serviceType: string) {
        if (serviceType === 'meal') {
            this.communicationService.serviceMealsChange({object: this.services['meal'], code: 'meal', booking: this.booking});
            if (this.services['meal']) {
                this.specialmeals.open();
            }
        } else if (serviceType === 'assistance') {
            this.communicationService.serviceAssistanceChange({object: this.services['assistance'], code: 'assistance', booking: this.booking});
            if (this.services['assistance']) {
                this.specialassistance.open();
            }
        } else if (serviceType === 'baggage') {
            this.communicationService.serviceBaggageChange({object: this.services['baggage'], code: 'baggage', booking: this.booking});
            if (this.services['baggage']) {
                this.baggage.open();
            }
        }
    }


    rs(serviceToRemove: any) {
        if (serviceToRemove === 'baggage') {
            this.selectedServicesMap['baggage'] = null;
        } else if (serviceToRemove === 'meal') {
            this.selectedServicesMap['meal'] = null;
        } else if (serviceToRemove === 'assistance') {
            this.selectedServicesMap['assistance']['hearing'] = null;
            this.selectedServicesMap['assistance']['special'] = null;
            this.selectedServicesMap['assistance']['visual'] = null;
        }
    }


    check(flight): boolean {
        let result = false;
        if (this.booking && this.booking.order && this.booking.order.seats) {
            for (let i = 0; i < this.booking.order.seats.length; i++) {
                if (this.checkCityNames(this.booking.order.seats[i], flight)) {
                    result = true;
                    break;
                }
            }
        }
        return result;

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

    checkAllFlightsSeats(): boolean {
        let flightLength = 0;
        if (this.booking && this.booking.order && this.booking.order.seats && this.booking.order.air) {
            this.booking.order.air.bounds.forEach(bound => {
                flightLength += bound.flights.length;
            });

            if (this.booking.order.seats.length === flightLength) {
                return true;
            }
        }
        return false;
    }


    calculateTotal(services: any): number {
        let total = 0;
        for (let i = 0; i < services.length; i++) {
            if (services[i].prices && services[i].prices.totalPrices) {
                total += services[i].prices.totalPrices[0].total.value;
            }
        }
        return total;

    }

    isEmptyObject(obj) {
        return (obj && (Object.keys(obj).length === 0));
    }


}


