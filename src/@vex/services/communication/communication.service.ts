import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Filter} from '../../../app/shared/models/filter/filter';
import {Sort} from '../../../app/shared/models/filter/sort';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {

    public fareFamilyDictionary = {};

    private filterChangeSubject = new Subject<any>();
    private sortChangeSubject = new Subject<any>();
    private stateChangeSubject = new Subject<any>();
    private passengerInfChangeSubject = new Subject<any>();
    private seatInfoChangeSubject = new Subject<any>();
    private bookingChangeSubject = new Subject<any>();
    private seatSelectBtnClick = new Subject<any>();
    private service = new Subject<any>();

    private serviceBaggage = new Subject<any>();
    private serviceMeal = new Subject<any>();
    private serviceAssistance = new Subject<any>();

    private serviceCreateEvent = new Subject<any>();
    private serviceChangeSubject = new Subject<any>();
    private durationChangeSubject = new Subject<any>();
    private changeNavigationSubject = new Subject<any>();
    private changeOfferIdSubject = new Subject<any>();

    public filterChangeObservable$ = this.filterChangeSubject.asObservable();
    public sortChangeObservable$ = this.sortChangeSubject.asObservable();
    public stateChangeObservable$ = this.stateChangeSubject.asObservable();
    public passengerInfChangeObservable$ = this.passengerInfChangeSubject.asObservable();
    public seatInfoChangeObservable$ = this.seatInfoChangeSubject.asObservable();
    public bookingChangeObservable$ = this.bookingChangeSubject.asObservable();
    public seatSelectBtnObservable$ = this.seatSelectBtnClick.asObservable();

    public serviceBaggageObservable$ = this.serviceBaggage.asObservable();
    public serviceAssistanceObservable$ = this.serviceAssistance.asObservable();
    public serviceMealObservable$ = this.serviceMeal.asObservable();

    public serviceCreateEventObservable$ = this.serviceCreateEvent.asObservable();
    public serviceChangeObservable$ = this.serviceChangeSubject.asObservable();
    public durationChangeObservable$ = this.durationChangeSubject.asObservable();
    public changeNavigationObservable$ = this.changeNavigationSubject.asObservable();

    public changeOfferIdObservable$ = this.changeOfferIdSubject.asObservable();

    constructor() {
    }

    filterChange(filter: Filter) {
        this.filterChangeSubject.next(filter);
    }

    sortChange(sort: Sort) {
        this.sortChangeSubject.next(sort);
    }

    stateChange(state: string) {
        this.stateChangeSubject.next(state);
    }

    passengerInfoChange(event: any) {
        this.passengerInfChangeSubject.next(event);
    }

    seatInfoChange(event: any) {
        this.seatInfoChangeSubject.next(event);
    }

    bookingChange(booking: any) {
        this.bookingChangeSubject.next(booking);
    }

    async seatSelectBtnClicked(data: any): Promise<any> {
        this.seatSelectBtnClick.next(data);
    }

    serviceBaggageChange(service: any) {
        this.serviceBaggage.next(service);
    }

    serviceAssistanceChange(service: any) {
        this.serviceAssistance.next(service);
    }

    serviceMealsChange(service: any) {
        this.serviceMeal.next(service);
    }

    serviceCreate(service: any) {
        this.serviceCreateEvent.next(service);
    }

    serviceChangeBooking(servicesMap: any) {
        this.serviceChangeSubject.next(servicesMap);
    }

    durationChange(duration: any) {
        this.durationChangeSubject.next(duration);
    }

    changeNavigationInfo(info: any) {
        this.changeNavigationSubject.next(info);
    }

    changeOfferId(offerId: any) {
        this.changeOfferIdSubject.next(offerId);
    }

}
