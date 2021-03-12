import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DeviceDetectorService} from 'ngx-device-detector';
import {IconService} from '../../../../@vex/services/icon.service';
import {Bound} from '../../../shared/models/bound/bound';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {Router} from "@angular/router";

@Component({
    selector: 'vex-details-header',
    templateUrl: './details-header.component.html',
    styleUrls: ['./details-header.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DetailsHeaderComponent implements OnInit {

    @Input() bound: Bound;
    @Input() fareFamilyDictionary: any;

    locale: string;
    isMobile = false;
    isDesktop = false;
    isTablet = false;
    rates = [];
    @Input() type: any;
    @Input() summary: boolean;
    selectedRate: any;

    @Output() selectEvent = new EventEmitter<void>();
    @Output() selectEvent2 = new EventEmitter<void>();
    @Output() selectEvent3 = new EventEmitter<void>();
    chosenRate: any;
    @Input() chosenRate2: any;

    constructor(
        private dialog: MatDialogRef<DetailsHeaderComponent>,
        private deviceService: DeviceDetectorService,
        public iconService: IconService,
        public router: Router,
        private _translateService: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();

        this.iconService = new IconService();
        if (this.isTablet && data || this.isMobile && data) {
            this.bound = data.bound;
            this.summary = data.summary;
            this.chosenRate = data.chosenRate;
            this.fareFamilyDictionary = data.fareFamilyDictionary;
            this.type = data.type;
        }

    }

    ngOnInit(): void {
        this.locale = this._translateService.currentLang;
        this._translateService.onLangChange
            .subscribe((langChangeEvent: LangChangeEvent) => {
                this.locale = langChangeEvent.lang;
            })
    }

    showRouteOrRate() {
        this.type = this.type === 'route' ? 'rates' : 'route';
    }

    rateSelected(event): void {
        this.selectedRate = event;
        if (!this.isTablet) {
            this.selectEvent.emit(event);
        }
    }

    close() {
        this.dialog.close();
    }

    approveSelect() {
        this.type = this.type === 'route' ? 'rates' : 'route';
        this.dialog.close(this.selectedRate);
    }

    millsIntoHours(duration: number): string {
        let result = '';
        let hour = 'h';
        let min = 'm';

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

        const totalMinutes = duration / 60;
        const totalHours = totalMinutes / 60;

        const minutes = Math.floor(totalMinutes) % 60;
        const hours = Math.floor(totalHours) % 60;

        if (hours !== 0) {
            result += hours + hour;

            if (minutes.toString().length === 1) {
                result += '0' + minutes + min;
            } else {
                result += minutes + min;
            }
        }


        return result;
    }

    getRouteActive() {
        return this.router.url;
    }


    selectRate() {
        this.selectEvent.emit(this.selectedRate);
    }
}
