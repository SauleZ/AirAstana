import {Component, Input, OnInit} from '@angular/core';
import {CdkStepper} from '@angular/cdk/stepper';
import icChevronLeft from '@iconify/icons-ic/chevron-left';
import {DeviceDetectorService} from 'ngx-device-detector';
import {BehaviorSubject} from 'rxjs';
import {Router} from "@angular/router";
import {CryptoService} from '../../../../app/utils/crypto.service';

@Component({
    selector: 'vex-custom-stepper',
    templateUrl: './custom-stepper.component.html',
    styleUrls: ['./custom-stepper.component.scss'],
    providers: [{provide: CdkStepper, useExisting: CustomStepperComponent}, {provide: DeviceDetectorService}]
})
export class CustomStepperComponent extends CdkStepper implements OnInit {

    icChevronLeft = icChevronLeft;

    index: number;
    @Input() route: any;
    @Input() router: Router;
    move = [];
    indexSubject = new BehaviorSubject(0);

    items = [{
        label: 'Select Flights',
        route: '',
    }, {
        label: 'Passenger details',
        route: '/passenger',
    }, {
        label: 'Services',
        route: '/services',
    }, {
        label: 'Check details',
        route: '/summary',
    }];
    booking: any;


    ngOnInit(): void {
        if (localStorage.getItem('index')) {
            this.index = +localStorage.getItem('index');
        }
        for (let i = 0; i < this.items.length; i++) {
            this.move[i] = false;
        }
        this.selectedIndex = this.index;
    }

    onClick(index: number) {

        if (localStorage.getItem('booking')) {
            // tslint:disable-next-line:prefer-const
            let c = new CryptoService();
            // this.booking = JSON.parse(localStorage.getItem('booking'));
            this.booking = c.decryptData(localStorage.getItem('booking'));

            // if ((this.booking.cart && index < 2) || (this.booking.order && this.booking.cart) && (index === 2 || index === 3)) {
            //     this.router.navigateByUrl(this.items[index].route);
            // }
        }
    }


}
