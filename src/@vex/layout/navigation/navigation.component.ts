import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Router} from '@angular/router';
import {ChangeContext, Options} from 'ng5-slider';
import {Filter} from '../../../app/shared/models/filter/filter';
import {CommunicationService} from '../../services/communication/communication.service';
import {MatDialog} from '@angular/material/dialog';
import {FilterMobileComponent} from './filter-mobile/filter-mobile.component';
import icChevronLeft from '@iconify/icons-ic/chevron-left';
import {Sort} from '../../../app/shared/models/filter/sort';
import {SortingMobileComponent} from './sorting-mobile/sorting-mobile.component';
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {CryptoService} from '../../../app/utils/crypto.service';

@Component({
    selector: 'vex-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.Default
})
export class NavigationComponent implements OnInit {

    icChevronLeft = icChevronLeft;
    getSlider3FromValue;
    getSlider3ToValue;
    getSlider2FromValue;
    getSlider2ToValue;
    getSlider1FromValue;
    getSlider1ToValue;
    state: number;
    minDuration = 0;
    maxDuration = 1440;
    flights = [];
    class = 'test';

    filter: Filter;
    sort: Sort;

    options: Options = {
        floor: 0,
        ceil: 1440
    };

    optionsDuration: Options = {
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
    isDesktop = false;
    isTablet = false;
    passengerCount = 0;
    locale: string;
    searchRequest: any;
    calendarResult: any;

    constructor(
        private communicationService: CommunicationService,
        private detectorService: DeviceDetectorService,
        private changeDetectorRef: ChangeDetectorRef,
        public router: Router,
        private _translateService: TranslateService,
        private matDialog: MatDialog,
        private _cryptoService: CryptoService
    ) {

        this.communicationService.changeNavigationObservable$.subscribe(info => {
            this.searchRequest = info;
            this.passengerCount = this.searchRequest.passengers.length;

        });

        if (localStorage.getItem('searchRequest')) {
            this.searchRequest = this._cryptoService.decryptData(localStorage.getItem('searchRequest'));
            this.passengerCount = this.searchRequest.passengers.length;
        }

        if (localStorage.getItem('calendarResult')) {
            this.calendarResult = this._cryptoService.decryptData(localStorage.getItem('calendarResult'));
            // // console.log('result', this.calendarResult);
        }

        this.isMobile = this.detectorService.isMobile();
        this.isDesktop = this.detectorService.isDesktop();
        this.isTablet = this.detectorService.isTablet();

        if (localStorage.getItem('state')) {
            this.state = +localStorage.getItem('state');
        }

        this.getFilter();

        if (localStorage.getItem('sort')) {
            this.sort = JSON.parse(localStorage.getItem('sort'));
        } else {
            this.sort = new Sort();
            this.sort.sortBy = 'duration';
            this.sort.orderBy = 'desc';
        }
    }

    ngOnInit() {

        this.locale = this._translateService.currentLang;
        this._translateService.onLangChange
            .subscribe((langChangeEvent: LangChangeEvent) => {
                this.locale = langChangeEvent.lang;
            });

        this.communicationService.durationChangeObservable$.subscribe(res => {
            this.minDuration = res.minDuration / 60;
            this.maxDuration = res.maxDuration / 60;

            this.optionsDuration = {
                floor: this.minDuration,
                ceil: this.maxDuration
            };
            this.filter.durationFrom = this.minDuration;
            this.filter.durationTo = this.maxDuration;
            this.changeDetectorRef.detectChanges();
        });
        this.changeDetectorRef.detectChanges();
    }

    getFilter() {
        if (localStorage.getItem('filter')) {
            this.filter = JSON.parse(localStorage.getItem('filter'));

            this.getSlider3FromValue = this.minDuration;
            this.getSlider3ToValue = this.maxDuration;
            this.getSlider2FromValue = 0;
            this.getSlider2ToValue = 1440;
            this.getSlider1FromValue = 0;
            this.getSlider1ToValue = 1440;
        } else {
            this.filter = new Filter();
            this.filter.durationFrom = this.minDuration;
            this.filter.durationTo = this.maxDuration;
            this.filter.departureFrom = 0;
            this.filter.departureTo = 1440;
            this.filter.arrivalFrom = 0;
            this.filter.arrivalTo = 1440;
            this.filter.withoutStops = false;

            this.getSlider3FromValue = this.filter.durationFrom;
            this.getSlider3ToValue = this.filter.durationTo;
            this.getSlider2FromValue = this.filter.arrivalFrom;
            this.getSlider2ToValue = this.filter.arrivalTo;
            this.getSlider1FromValue = this.filter.departureFrom;
            this.getSlider1ToValue = this.filter.departureTo;

        }
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

    getRouteActive() {
        return this.router.url;
    }

    save() {
        localStorage.setItem('filter', JSON.stringify(this.filter));
        this.communicationService.filterChange(this.filter);
    }

    reset(): void {
        this.filter = new Filter();
        this.filter.durationFrom = this.minDuration;
        this.filter.durationTo = this.maxDuration;
        this.filter.departureFrom = 0;
        this.filter.departureTo = 1440;
        this.filter.arrivalFrom = 0;
        this.filter.arrivalTo = 1440;
        this.filter.withoutStops = false;
    }

    openSideNav(action?: string): void {
        if (this.isMobile) {
            const matDialogRef = this.matDialog.open(FilterMobileComponent, {
                width: '100%',
                maxWidth: '100%',
                height: '81%',
                panelClass: 'custom'
            });

            // matDialogRef.afterClosed().subscribe(total => {
            //     this.select.total = total;
            // });
        }
    }

    openSideNav2(action?: string): void {
        if (this.isMobile) {
            const matDialogRef = this.matDialog.open(SortingMobileComponent, {
                width: '100%',
                maxWidth: '100%',
                height: '81%',
                panelClass: 'custom'
            });

            // matDialogRef.afterClosed().subscribe(total => {
            //     this.select.total = total;
            // });
        }
    }

    sortSelected(sortBy: string) {
        this.sort.sortBy = sortBy;
        localStorage.setItem('sort', JSON.stringify(this.sort));
        this.communicationService.sortChange(this.sort);
    }

    filterOpen() {
        this.getFilter();

        this.class = 'test';
        setTimeout(() => {
            this.class = 'test2'
        }, 100)
    }

}
