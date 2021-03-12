import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Filter} from '../../../../app/shared/models/filter/filter';
import {Options} from 'ng5-slider';
import {CommunicationService} from '../../../services/communication/communication.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import icClear from '@iconify/icons-ic/clear';

@Component({
    selector: 'vex-filter-mobile',
    templateUrl: './filter-mobile.component.html',
    styleUrls: ['./filter-mobile.component.scss']
})
export class FilterMobileComponent implements OnInit {

    icClear = icClear;


    getSlider3FromValue;
    getSlider3ToValue;
    getSlider2FromValue;
    getSlider2ToValue;
    getSlider1FromValue;
    getSlider1ToValue;
    filter: Filter;
    class = 'test';

    options: Options = {
        floor: 0,
        ceil: 1440
    };

    items = [{
        label: 'Select Flights',
        route: '/',
        type: 'link',
        icon: ''
    }, {
        label: 'Passenger details',
        route: '/passenger',
        type: 'link',
        icon: ''
    }, {
        label: 'Services',
        route: '/services',
        type: 'link',
        icon: ''
    }];
    active = true;
    isMobile = false;


    constructor(
        private communicationService: CommunicationService,
        private detectorService: DeviceDetectorService,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private matDialog: MatDialog,
        private dialog: MatDialogRef<FilterMobileComponent>
    ) {
        if (localStorage.getItem('filter')) {
            this.filter = JSON.parse(localStorage.getItem('filter'))
        } else {
            this.filter = new Filter();
            this.filter.durationFrom = 0;
            this.filter.durationTo = 1440;
            this.filter.departureFrom = 0;
            this.filter.departureTo = 1440;
            this.filter.arrivalFrom = 0;
            this.filter.arrivalTo = 1440;

        }

        this.isMobile = this.detectorService.isMobile();
    }

    ngOnInit() {
        this.changeDetectorRef.detectChanges();
        this.getSlider3FromValue = this.filter.durationFrom;
        this.getSlider3ToValue = this.filter.durationTo;
        this.getSlider2FromValue = this.filter.arrivalFrom;
        this.getSlider2ToValue = this.filter.arrivalTo;
        this.getSlider1FromValue = this.filter.departureFrom;
        this.getSlider1ToValue = this.filter.departureTo;
        this.class = 'test';
        setTimeout(() => {
            this.class = 'test2'
        }, 100)
    }

    minutesToHours(duration: number, withLetters: boolean): string {
        let result = '';

        const totalMinutes = duration;
        const totalHours = totalMinutes / 60;

        const minutes = Math.floor(totalMinutes) % 60;
        const hours = Math.floor(totalHours) % 60;

        result += hours <= 9 ? '0' + hours : hours;

        result += withLetters ? 'ч ' : ':';

        if (minutes.toString().length === 1) {
            result += '0' + minutes;
        } else {
            result += minutes;
        }

        result += withLetters ? 'м' : '';

        return result;
    }

    save() {
        localStorage.setItem('filter', JSON.stringify(this.filter));
        this.communicationService.filterChange(this.filter);
        this.dialog.close();
    }

    closeClick(): void {
        this.dialog.close();
    }

    reset(): void {
        this.filter = new Filter();
        this.filter.durationFrom = 0;
        this.filter.durationTo = 1440;
        this.filter.departureFrom = 0;
        this.filter.departureTo = 1440;
        this.filter.arrivalFrom = 0;
        this.filter.arrivalTo = 1440;
        this.filter.withoutStops = false;
    }
}
