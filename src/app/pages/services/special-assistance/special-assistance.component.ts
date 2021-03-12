import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatSidenav} from '@angular/material/sidenav';
import {SidebarComponent} from '../../../../@vex/components/sidebar/sidebar.component';
import {IconService} from '../../../../@vex/services/icon.service';
import {MatDialogRef} from '@angular/material/dialog';
import {CommunicationService} from '../../../../@vex/services/communication/communication.service';
import {SeatmapService} from '../../../shared/api/seatmap.service';
import {OrderService} from '../../../shared/api/order.service';
import {CryptoService} from '../../../utils/crypto.service';
import {stringify} from "querystring";
import {MatSlideToggle, MatSlideToggleChange} from "@angular/material/slide-toggle";

@Component({
    selector: 'vex-special-assistance',
    templateUrl: './special-assistance.component.html',
    styleUrls: ['./special-assistance.component.scss']
})
export class SpecialAssistanceComponent implements OnInit {
    @ViewChild('sidenav') sidenav: MatSidenav;
    @ViewChild('configpanel', {static: true}) configpanel: SidebarComponent;
    @ViewChild('matSlideToggle1') isSelected1;
    @ViewChild('matSlideToggle2') isSelected2;
    @ViewChild('matSlideToggle3') isSelected3;
    @ViewChild('matSlideToggle4') isSelected4;
    @ViewChild('matSlideToggle5') isSelected5;
    @ViewChild('matSlideToggle6') isSelected6;
    @Output() close = new EventEmitter<any>();
    isMobile = false;
    isDesktop = false;
    isTablet = false;
    booking: any;
    services: any;
    globalLoading = false;
    selectedServiceMap = {};
    servicesTypes: any = {};
    requestBody: any[] = [];
    finalBody: any = {};
    flightIds = [];

    result: any = {};
    request: any[] = [];

    public options = [
        {key: 'Wheelchair to a seat on the plane', value: 'Wheelchair to a seat on the plane'},
        {key: 'Wheelchair to the gangway', value: 'Wheelchair to the gangway'},
        {key: 'Wheelchair to a seat on the plane', value: 'Wheelchair to a seat on the plane'}
    ];
    exist = false;
    serviceContent: any = {};
    serviceContentFirst: any = {};


    constructor(
        private deviceService: DeviceDetectorService,
        public _iconService: IconService,
        private dialog: MatDialogRef<SpecialAssistanceComponent>,
        private seatmapService: SeatmapService,
        private communicationService: CommunicationService,
        public orderService: OrderService,
        private _cryptoService: CryptoService
    ) {

        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();

        this.finalBody['hearing'] = [];
        this.finalBody['special'] = [];
        this.finalBody['visual'] = [];

    }

    ngOnInit(): void {
        this.whenServiceRetrieved();
    }

    whenServiceRetrieved() {
        this.communicationService.serviceAssistanceObservable$.subscribe(value => {
            this.globalLoading = true;
            if (value.code === 'assistance') {
                this.services = value.object;
            }

            this.booking = value.booking;

            if (this.booking.order) {
                for (let i = 0; i < this.booking.order.air.bounds.length; i++) {
                    for (let j = 0; j < this.booking.order.air.bounds[i].flights.length; j++) {
                        const flightId = this.booking.order.air.bounds[i].flights[j].id;
                        if (!this.flightIds.includes(flightId)) {
                            this.flightIds.push(this.booking.order.air.bounds[i].flights[j].id);
                        }
                    }
                }
            }

            this.selectedServiceMap = {};
            this.servicesTypes = {};
            this.requestBody = [];
            this.finalBody = {};

            if (value.code === 'assistance') {
                this.services = value.object;
                if (this.services) {
                    const serviceKeys = Object.keys(this.services);
                    for (let i = 0; i < serviceKeys.length; i++) {
                        this.selectedServiceMap[serviceKeys[i]] = {};
                        this.fillAssistanceList(serviceKeys[i]);
                    }
                }
            }

            this.globalLoading = false;
        });
    }

    fillAssistanceList(type: string) {
        if (!this.servicesTypes[type]) {
            this.servicesTypes[type] = [];
        }

        for (let i = 0; i < this.services[type].length; i++) {
            if (i !== 0 && this.services[type][i].code !== this.services[type][i - 1].code) {
                this.servicesTypes[type].push(this.services[type][i]);
            } else if (i === 0) {
                this.servicesTypes[type].push(this.services[type][i]);
            }
        }


        if (localStorage.getItem('serviceContent')) {
            this.serviceContent = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));
            this.serviceContentFirst = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));

            if (this.serviceContent['assistance']) {
                this.selectedServiceMap = this.serviceContent['assistance'];
            }

        }
    }


    closeClick(text?: string): void {
        if (text && text === 'cancel') {
            this.close.emit();
        } else {
            this.globalLoading = true;

            for (let i = 0; i < this.booking.order.passengers.length; i++) {

                for (let j = 0; j < Object.keys(this.services).length; j++) {

                    if (this.selectedServiceMap[Object.keys(this.services)[j]][this.booking.order.passengers[i].id]) {

                        const body: any = {};
                        body.serviceId = this.selectedServiceMap[Object.keys(this.services)[j]][this.booking.order.passengers[i].id];
                        body.travelerId = this.booking.order.passengers[i].id;
                        body.quantity = 1;
                        // body.flightIds = this.flightIds;
                        if (this.requestBody.indexOf(body) === -1) {
                            this.requestBody.push(body);
                            this.groupAssistanceTypes(Object.keys(this.services)[j], body);

                        }

                    }
                }

            }

            const service: any = {};
            service['assistance'] = this.finalBody;

            if (this.serviceContent && this.serviceContent['assistance']) {
                if ((stringify(this.serviceContentFirst['assistance']['hearing']) !== stringify(this.selectedServiceMap['hearing'])) ||
                    (stringify(this.serviceContentFirst['assistance']['special']) !== stringify(this.selectedServiceMap['special'])) ||
                    (stringify(this.serviceContentFirst['assistance']['visual']) !== stringify(this.selectedServiceMap['visual']))) {
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
            this.orderService.getOrder(this.booking.order.id, this.booking.lastName).subscribe(order => {
                this.serviceContent['assistance'] = this.selectedServiceMap;

                localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));
                this.booking.order = order.data;
                this.communicationService.serviceChangeBooking(this.booking.order.services);
                localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
                localStorage.setItem('booking2', JSON.stringify(this.booking));

                this.communicationService.bookingChange(this.booking);

                this.close.emit(this.finalBody);
                this.globalLoading = false;

            });
        });
    }

    groupAssistanceTypes(serviceType: string, body: any) {
        if (!this.finalBody[serviceType]) {
            this.finalBody[serviceType] = [];
        }
        this.finalBody[serviceType].push(body);
    }

    getKeys(object: any) {
        return Object.keys(object);
    }

    deleteService(service) {
        this.globalLoading = true;
        let serviceIds = '';

        for (let i = 0; i < this.getKeys(this.booking.order.services['assistance']).length; i++) {
            const key = this.getKeys(this.booking.order.services['assistance'])[i];
            for (const item of this.booking.order.services['assistance'][key]) {
                console.log('item.serviceId');
                console.log(item.serviceId);
                if (!serviceIds) {
                    serviceIds += item.serviceId;
                } else {
                    serviceIds += ',' + item.serviceId;
                }
            }
        }

        if (serviceIds !== '') {
            this.seatmapService.deleteServiceByIds(this.booking.order.id, serviceIds, this.booking.lastName).subscribe(res => {
                this.addServiceToOrder(service);
            });
        } else {
            this.addServiceToOrder(service);
        }

    }

    setNull($event: MatSlideToggleChange, matSlideToggle: MatSlideToggle, id: any, serviceType: string) {
        console.log('this.selectedServiceMap');
        console.log(this.selectedServiceMap);
        console.log('this.booking.order.services');
        console.log(this.booking.order.services);
        console.log('this.selectedServiceMap[serviceType]');
        console.log(this.selectedServiceMap[serviceType]);
        if (!matSlideToggle.checked) {
            this.selectedServiceMap[serviceType][id] = null;
            this.booking.order.services['meal'][id] = null;
        }
    }
}
