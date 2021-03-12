import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnDestroy,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {Subject} from 'rxjs';
import {DeviceDetectorService} from 'ngx-device-detector';
import {IconService} from '../../../../@vex/services/icon.service';
import {CalendarService} from '../../../shared/api/calendar.service';
import {StaticRequest} from '../../../shared/api/static-request';
import {takeUntil} from 'rxjs/operators';
import {CalendarReply} from '../../../shared/models/calendar/calendar-reply';
import {RestResponse} from '../../../utils/rest-response';
import {Router} from '@angular/router';
import {FakeDb} from '../fake-db';
import {MatDialog} from '@angular/material/dialog';
import {GlobalFilterComponent} from './global-filter/global-filter.component';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {CryptoService} from '../../../utils/crypto.service';

@Component({
    selector: 'vex-flex-calendar',
    templateUrl: './flex-calendar.component.html',
    styleUrls: ['./flex-calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FlexCalendarComponent implements OnInit, OnDestroy, AfterViewChecked {

    @Output() eventExecuted: EventEmitter<any> = new EventEmitter<any>();

    continueResult: any;

    calendarReply: CalendarReply;
    calendarReturnDates: string[] = [];
    calendarDepartureDates: string[] = [];
    calendarDepartureDatesMap: any = {};

    selectedDeparture: string;
    selectedReturn: string;

    selectedRow: number;
    selectedColumn: number;

    selectedDate = false;
    globalLoading: boolean;

    prices = [1, 2, 3, 4, 5, 6, 7];
    minPrice: number;
    locale: string;

    isMobile: boolean;
    flights = [];

    calendarSelection: any;

    searchRequest: any;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    private _unsubscribeAll: Subject<any>;

    constructor(
        public _dialog: MatDialog,
        private changeDetector: ChangeDetectorRef,
        public _iconService: IconService,
        private _calendarService: CalendarService,
        private _deviceDetectorService: DeviceDetectorService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private _translateService: TranslateService,
        private _cryptoService: CryptoService
    ) {
        this._unsubscribeAll = new Subject<any>();
        this.isMobile = _deviceDetectorService.isMobile();
        this.globalLoading = true;
        this.locale = this._translateService.currentLang;
        this._translateService.onLangChange
            .subscribe((langChangeEvent: LangChangeEvent) => {
                this.locale = langChangeEvent.lang;
            });

        if (localStorage.getItem('searchRequest')) {
            this.searchRequest = this._cryptoService.decryptData(localStorage.getItem('searchRequest'));
            this.getCalendar(this.searchRequest);
            // console.log('this.searchRequest');
            // console.log(this.searchRequest);
        } else {
            this.formRequestAndSend();
            this.clearAllExceptForToken();
        }
    }

    ngOnInit(): void {
        if (localStorage.getItem('calendarResult')) {
            this.continueResult = this._cryptoService.decryptData(localStorage.getItem('calendarResult'));
        }
    }

    ngAfterViewChecked() {
        this.changeDetector.detectChanges();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    isActual(calendar: any): boolean {
        const currentDate = new Date();
        if (calendar !== null) {
            const calendarDepartureDate = new Date(calendar.departureDate);
            const calendarReturnDate = new Date(calendar.returnDate);

            if (calendarDepartureDate.getMilliseconds() >= currentDate.getMilliseconds() ||
                calendarReturnDate.getMilliseconds() >= currentDate.getMilliseconds()) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }


    formRequestAndSend(): void {
        this.flights = FakeDb.FLIGHTS;
        const request = StaticRequest.SEARCH_CALENDAR_BODY;
        this.getCalendar(request);
    }

    refreshFilter(): void {
        this.formRequestAndSend();
    }

    changeDetect(): void {
        setTimeout(() => {
            this._changeDetectorRef.detectChanges()
        }, 1500);
    }

    clearAllExceptForToken(): void {
        localStorage.removeItem('booking');
        localStorage.removeItem('flights');
        localStorage.removeItem('index');
        localStorage.removeItem('state');
        localStorage.removeItem('pForm');
        localStorage.removeItem('taxInfo');
        localStorage.removeItem('serviceContent');
        localStorage.removeItem('servicesTotal');
        localStorage.removeItem('filter');
        // localStorage.removeItem('searchRequest');
    }

    getCalendar(request: any): void {
        this.globalLoading = true;
        this._calendarService.searchCalendar(request).pipe(takeUntil(this._unsubscribeAll)).subscribe((res: RestResponse) => {
            if (res.data) {
                this.calendarReply = res.data;
                if (this.calendarReply) {
                    this.calendarReturnDates = Object.keys(this.calendarReply);
                    this.calendarReturnDates.forEach(date => {
                        // console.log('date ' + date);
                        if (this.calendarReply[date]) {
                            this.calendarDepartureDates = Object.keys(this.calendarReply[date]);
                            // console.log(this.calendarDepartureDates);

                            this.calendarDepartureDates.forEach(date2 => {
                                // console.log('date 2 ' + date2);
                                // console.log('date ' + date);
                                // console.log(this.calendarReply[date][date2]);
                                this.calendarDepartureDatesMap[date] = this.calendarReply[date][date2];
                                // console.log(this.calendarDepartureDatesMap[date]);

                            });
                            // console.log('testing calendar');
                            // console.log(this.calendarDepartureDatesMap);
                            // console.log(this.calendarDepartureDatesMap[date]);
                            // console.log('-------------------------------');


                            if (localStorage.getItem('calendarSelection')) {
                                this.calendarSelection = this._cryptoService.decryptData(localStorage.getItem('calendarSelection'));

                                const currentDate = new Date();
                                const selectionDate = new Date(this.calendarSelection.activeUntil);

                                if (this.calendarSelection && selectionDate.getMilliseconds() <= currentDate.getMilliseconds()) {
                                    this.selectedDate = true;

                                    this.selectedColumn = this.calendarSelection.selectedColumn;
                                    this.selectedRow = this.calendarSelection.selectedRow;

                                    this.selectedDeparture = this.calendarSelection.selectedDeparture;
                                    this.selectedReturn = this.calendarSelection.selectedReturn;
                                }
                            }
                        }
                        this.changeDetect();

                    });
                }
            } else {
                this.displayMessage('no flights');
            }
            this.globalLoading = false;
        }, error => {
            this.globalLoading = false;
            // this.displayMessage(error);
        });
    }

    continue(): void {
        this.continueResult = this.calendarReply[this.selectedReturn][this.selectedDeparture];
        localStorage.setItem('calendarResult', this._cryptoService.encryptData(this.continueResult));
        this.clearAllExceptForToken();
        this._router.navigateByUrl('');
    }


    selectDates(i, j, r, p) {

        if (this.calendarReply && this.calendarReply[r] && this.calendarReply[r][p]?.total) {
            this.selectedDate = true;

            this.selectedColumn = j;
            this.selectedRow = i;

            this.selectedDeparture = this.calendarDepartureDates[j];
            this.selectedReturn = this.calendarReturnDates[i];

            const currentTime = new Date();
            currentTime.setHours(currentTime.getHours() + 1);

            this.calendarSelection = {
                selectedColumn: j,
                selectedRow: i,
                selectedDeparture: this.selectedDeparture,
                selectedReturn: this.selectedReturn,
                activeUntil: currentTime
            };

            localStorage.setItem('calendarSelection', this._cryptoService.encryptData(this.calendarSelection));
            localStorage.removeItem('calendarResult');

            this._changeDetectorRef.detectChanges();
        } else {
            this.displayMessage('There are no available flights! Dates cannot be selected.');
        }

    }

    displayMessage(text: string): void {
        this._snackBar.open(text, '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    defineMinPrice(total: number): string {
        if (!this.minPrice) {
            this.minPrice = total;
        } else if (total < this.minPrice) {
            this.minPrice = total;
        }

        return total.toString();
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


    checkMinPrice(minPrice: number, calendar: any): boolean {
        if (calendar != null)
            return minPrice === calendar.total;
    }
}
