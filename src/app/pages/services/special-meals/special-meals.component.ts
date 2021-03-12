import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
import {SidebarComponent} from '../../../../@vex/components/sidebar/sidebar.component';
import {LayoutService} from '../../../../@vex/services/layout.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {IconService} from '../../../../@vex/services/icon.service';
import {SeatmapService} from '../../../shared/api/seatmap.service';
import {CommunicationService} from '../../../../@vex/services/communication/communication.service';
import {OrderService} from '../../../shared/api/order.service';
import {CryptoService} from '../../../utils/crypto.service';
import {stringify} from 'querystring';

@Component({
    selector: 'vex-special-meals',
    templateUrl: './special-meals.component.html',
    styleUrls: ['./special-meals.component.scss']
})
export class SpecialMealsComponent implements OnInit {


    @Input() pasOneBag = 0;
    @Input() pasTwoBag = 0;
    @ViewChild('sidenav') sidenav: MatSidenav;
    @ViewChild('configpanel', {static: true}) configpanel: SidebarComponent;
    // tslint:disable-next-line:no-output-native
    @Output() close = new EventEmitter<any>();

    isMobile = false;
    isDesktop = false;
    isTablet = false;
    screenHeight: number;
    screenWidth: number;
    total = 0;
    booking: any;
    services: any;
    flightServices: any = {};
    selectedServiceMap: any = {};
    requestBody: any[] = [];
    result: any = {};
    request: any[] = [];
    globalLoading = false;
    exist = false;
    options = [1, 2, 3];
    serviceContent: any = {};
    serviceContentFirst: any = {};
    mealError: string;

    constructor(
        private layoutService: LayoutService,
        private deviceService: DeviceDetectorService,
        private seatmapService: SeatmapService,
        private _cryptoService: CryptoService,
        public _iconService: IconService,
        public orderService: OrderService,
        private communicationService: CommunicationService) {

        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
    }

    ngOnInit(): void {
        this.whenServiceRetrieved();
    }

    whenServiceRetrieved() {
        this.communicationService.serviceMealObservable$.subscribe(value => {

            if (value.code === 'meal') {
                this.services = value.object;
            }

            this.globalLoading = true;

            this.booking = value.booking;

            this.selectedServiceMap = {};

            if (this.booking.order) {
                if (localStorage.getItem('serviceContent')) {
                    this.serviceContent = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));
                    this.serviceContentFirst = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));

                    if (this.serviceContent['meal']) {
                        // console.log('Service content is not empty');
                        // console.log(this.serviceContent);
                        this.selectedServiceMap = this.serviceContent['meal'];
                    }

                }
            }

            this.requestBody = [];

            if (value.code === 'meal') {
                this.services = value.object;
                this.flightServices = {};

                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < this.services.length; i++) {

                    if (!this.flightServices[this.services[i].flightId]) {
                        this.flightServices[this.services[i].flightId] = [];
                    }
                    this.flightServices[this.services[i].flightId].push(this.services[i]);
                }

            }

            this.globalLoading = false;

        });
    }


    closeClick(text?: string): void {

        if (text && text === 'cancel') {
            this.mealError = null;
            this.close.emit();
        } else {
            this.globalLoading = true;
            for (let i = 0; i < this.booking.order.passengers.length; i++) {
                if (this.selectedServiceMap[this.booking.order.passengers[i].id]) {

                    const body: any = {};
                    body.serviceId = this.selectedServiceMap[this.booking.order.passengers[i].id];
                    body.travelerId = this.booking.order.passengers[i].id;
                    body.quantity = 1;
                    this.requestBody.push(body);
                }

            }

            const service: any = {};
            service['meal'] = this.requestBody;
            // console.log('this.requestBody');
            // console.log(this.requestBody);
            if (this.serviceContent && this.serviceContent['meal'] && this.serviceContent['meal'].length !== 0) {
                if (stringify(this.serviceContentFirst['meal']) !== stringify(this.selectedServiceMap)) {
                    // console.log('here')
                    // console.log(this.selectedServiceMap)
                    if (localStorage.getItem('booking')) {
                        this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
                        localStorage.setItem('booking2', JSON.stringify(this.booking));
                    }

                    // console.log(!this.mealError)
                    // console.log(this.booking.order.services['meal'])

                    if (!this.mealError && this.booking.order.services['meal'] &&
                        (this.booking.order.services['meal'].serviceId || (this.booking.order.services['meal'][0] && this.booking.order.services['meal'][0].serviceId))) {
                        this.deleteService(service);
                        // console.log('here 2')
                    } else {
                        this.addServiceToOrder(service);
                    }
                    // this.globalLoading = false;
                } else {
                    this.mealError = null;
                    this.close.emit();
                }
            } else {
                this.addServiceToOrder(service);
            }
        }
    }

    addServiceToOrder(service) {
        // console.log('service')
        // console.log(service)
        // console.log('this.serviceContent')
        // console.log(this.serviceContent)
        if (service !== ' ')
            this.seatmapService.addServiceToOrder(this.booking.order.id, service, this.booking.lastName).subscribe(res => {
                // console.log('Kirdi')
                this.orderService.getOrder(this.booking.order.id, this.booking.lastName).subscribe(order => {
                    this.serviceContent['meal'] = this.selectedServiceMap;
                    localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));
                    this.booking.order = order.data;
                    this.communicationService.serviceChangeBooking(this.booking.order.services);
                    localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
                    localStorage.setItem('booking2', JSON.stringify(this.booking));

                    this.communicationService.bookingChange(this.booking);

                    this.close.emit(this.requestBody);
                    this.globalLoading = false;
                    this.mealError = null;
                });
                this.mealError = null;
            }, mealError => {
                if (mealError.error && mealError.error.errors && mealError.error.errors[0]) {
                    this.mealError = mealError.error.errors[0].title;
                    this.mealError += '\n' + ' Please select a different meal.';
                } else {
                    this.mealError += 'Please select a different meal.';
                }
                // console.log(this.selectedServiceMap);

                this.orderService.getOrder(this.booking.order.id, this.booking.lastName).subscribe(order => {

                    this.booking.order = order.data;
                    // this.communicationService.serviceChangeBooking(this.booking.order.services);
                    localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
                    localStorage.setItem('booking2', JSON.stringify(this.booking));
                    this.communicationService.serviceChangeBooking(this.booking.order.services);
                    this.communicationService.bookingChange(this.booking);


                    this.selectedServiceMap = {};
                    this.requestBody = [];
                    this.globalLoading = false;

                    delete this.serviceContent['meal'];

                    localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));
                    localStorage.setItem('serviceContent2', JSON.stringify(this.serviceContent));
                });

                // setTimeout(res => {
                //     this.close.emit(this.requestBody);
                // }, 2000);

            });

    }

    deleteService(service) {
        this.globalLoading = true;
        let serviceIds = '';
        for (const item of this.booking.order.services['meal']) {

            if (!serviceIds) {
                serviceIds += item.serviceId;
            } else {
                serviceIds += ',' + item.serviceId;
            }
        }
        // console.log(serviceIds)

        this.seatmapService.deleteServiceByIds(this.booking.order.id, serviceIds, this.booking.lastName).subscribe(res => {
            this.addServiceToOrder(service);
        }, mealError => {
            if (mealError.error && mealError.error.errors && mealError.error.errors[0]) {
                this.mealError = mealError.error.errors[0].title;
                this.mealError += '\n' + ' Please select a different meal.';
            } else {
                this.mealError += 'Please select a different meal.';
            }
            this.globalLoading = false;
            // if (this.serviceContentFirst['meal']) {
            //     this.addServiceToOrder(' ');
            //     this.selectedServiceMap = {};
            // }
        });

    }

}
