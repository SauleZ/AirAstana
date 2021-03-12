import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import icClear from '@iconify/icons-ic/clear';
import {DeviceDetectorService} from 'ngx-device-detector';
import {CartService} from '../../../shared/api/cart.service';
import {Bound} from '../../../shared/models/bound/bound';
import {DictionaryService} from '../../../shared/api/dictionary.service';
import {CommunicationService} from '../../../../@vex/services/communication/communication.service';
import {CryptoService} from '../../../utils/crypto.service';

@Component({
    selector: 'vex-flights-rates',
    templateUrl: './flights-rates.component.html',
    styleUrls: ['./flights-rates.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FlightsRatesComponent implements OnInit {

    icClear = icClear;
    isMobile = false;
    isDesktop = false;
    isTablet = false;
    select = false;
    selectedRateNLoc: any;
    customRates: any;
    fareFamilyMap = {};
    @Input() offerIds: any;
    @Input() fareFamilyDictionary: any;
    @Input() bound: Bound;
    @Input() chosenRate: any;
    @Output() selectEvent = new EventEmitter<any>();

    rateItemMap: any;

    rates: any[] = [];
    selectedRates: any[] = [];

    constructor(
        private deviceService: DeviceDetectorService,
        private cartService: CartService,
        private communicationService: CommunicationService,
        private dictionaryService: DictionaryService,
        private _cryptoService: CryptoService
    ) {
        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
        this.isTablet = this.deviceService.isTablet();

        this.communicationService.changeOfferIdObservable$.subscribe(res => {
            this.offerIds = res;
            if (this.offerIds) {
                this.checkOfferIds();
            }
        });


    }

    ngOnInit(): void {

        this.customRates = this.bound.rates;
        if (localStorage.getItem('rateTest')) {
            this.selectedRateNLoc = JSON.parse(localStorage.getItem('rateTest'));

        }
        this.rateItemMap = {};

        if (this.fareFamilyDictionary) {
            this.rateItemMap = this.fareFamilyDictionary;
        }
    }

    checkOfferIds() {
        this.customRates = this.bound.rates;
        let finalCheck = false;
        for (const rate of this.customRates) {
            for (const offerId of rate.offerIds) {
                if (this.findCommonOfferId(offerId)) {
                    finalCheck = true;
                    break;
                }

            }
            rate.offerIdsCheck = finalCheck;
        }
    }


    findCommonOfferId(offerId2) {
        for (const offerId of this.offerIds) {
            if (offerId === offerId2) {
                return true;
            }
        }
        return false;
    }


    getIcon(value: string) {
        const hasNumber = '/\d/';
        if (value.includes('not')) {
            return 'not included';
        } else if (value.includes('included') || (value.includes('kg') && value.includes('*') && value.includes('PC'))) {
            return 'included';
        } else {
            return 'paid';
        }
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    selectItem(rate, rateIndex) {
        this.communicationService.stateChange('1');
        const selectionResult = {rate, bound: this.bound};
        this.selectedRates.push(rate);
        this.selectEvent.emit(selectionResult);

        this.setBaggage();
    }

    setBaggage() {
        const aboutBaggage = this.rateItemMap[this.bound.rates[0].fareFamilyContainer.id].characteristics;
        // tslint:disable-next-line:forin
        for (const x in aboutBaggage) {
            if (aboutBaggage[x].title === 'Baggage') {
                localStorage.setItem('baggageAllowance', this._cryptoService.encryptData(aboutBaggage[x].value));
            }
            if (aboutBaggage[x].title === 'Hand luggage' || aboutBaggage[x].title === 'Cabin bags') {
                localStorage.setItem('handLuggage', this._cryptoService.encryptData(aboutBaggage[x].value));
            }
        }
    }

    priceView(price: string): string {
        let result = '';
        price = price.split('').reverse().join('')
        for (let i = price.length - 1; i >= 0; i--) {
            result += price.charAt(i);
            if (i !== 0 && i % 3 === 0 && !price.includes(',') && !price.includes('.')) {
                result += ' ';
            }
        }
        return result;

    }
}
