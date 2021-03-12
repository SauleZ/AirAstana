import {Component, Input, OnInit} from '@angular/core';
import {Bound} from '../../../shared/models/bound/bound';
import {FlightContainer} from '../../../shared/models/flight/flight-container';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'vex-flight-route',
    templateUrl: './flight-route.component.html',
    styleUrls: ['./flight-route.component.scss']
})
export class FlightRouteComponent implements OnInit {

    flights: FlightContainer[]=[];
    locale: string;
    @Input() bound: Bound;
    isMobile = false;
    isDesktop = false;
    isTablet = false;

    constructor(private deviceService: DeviceDetectorService,
                private _translateService: TranslateService
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
        this.isTablet = this.deviceService.isTablet();
    }

    ngOnInit(): void {
        this.locale = this._translateService.currentLang;
        this._translateService.onLangChange
            .subscribe((langChangeEvent: LangChangeEvent) => {
                this.locale = langChangeEvent.lang;
            });
        this.flights = this.bound.flights;
    }

    millsIntoHours(duration: number): string {
        let result = '';
        let hour = 'h';
        let min = 'm';
        const totalMinutes = duration / 60;
        const totalHours = totalMinutes / 60;

        const minutes = Math.floor(totalMinutes) % 60;
        const hours = Math.floor(totalHours) % 60;

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

        if (hours !== 0) {
            result += hours + hour;
        } else {
            result += ''
        }

        if (minutes.toString().length === 1) {
            result += '0' + minutes + min;
        } else {
            result += minutes + min;
        }

        return result;
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


}
