import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';
import {State} from '../state';
import {CartService} from '../../shared/api/cart.service';
import {OrderService} from '../../shared/api/order.service';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {CartRequest} from '../../shared/models/cart/cart-request';
import {Passenger} from '../../shared/models/passenger/passenger';
import {FrequentFlyerCard} from '../../shared/models/card/frequent-flyer-card';
import {ActivatedRoute, Router} from '@angular/router';
import {Email} from '../../shared/models/personal-info/email';
import {Phone} from '../../shared/models/personal-info/phone';
import {Personality} from '../../shared/models/personal-info/personality';
import {BehaviorSubject, Subscription, throwError} from 'rxjs';
import {CommunicationService} from '../../../@vex/services/communication/communication.service';
import {IconService} from '../../../@vex/services/icon.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {CryptoService} from '../../utils/crypto.service';
import {PassengerFormData} from '../../shared/custom/passenger-form-data';
import {ContactFormData} from '../../shared/custom/contact-form-data';
import {TranslateService} from '@ngx-translate/core';
import {SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat} from 'ngx-intl-tel-input';

export const MY_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY',
    },
};

@Component({
    selector: 'vex-passenger-details',
    templateUrl: './passenger-details.component.html',
    styleUrls: ['./passenger-details.component.scss'],
    // providers: [
    //     {provide: MAT_DATE_LOCALE, useValue: 'ru'},
    //     {
    //         provide: DateAdapter,
    //         useClass: MomentDateAdapter,
    //         deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    //     },
    //     {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    // ],
})
export class PassengerDetailsComponent implements OnInit, AfterViewInit {

    constructor(
        private formBuilder: FormBuilder,
        private deviceService: DeviceDetectorService,
        private cartService: CartService,
        private orderService: OrderService,
        public iconService: IconService,
        private route: ActivatedRoute,
        private communicationService: CommunicationService,
        private _translateService: TranslateService,
        private router: Router,
        private _snackBar: MatSnackBar,
        private _cryptoService: CryptoService,
        // private _adapter: DateAdapter<any>
    ) {

        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
        this.isTablet = this.deviceService.isTablet();

        this.globalLoading = true;

        let orderExist = false;
        if (localStorage.getItem('booking')) {
            this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));

            if (this.booking.order && this.booking.order.passengers && this.booking.order.passengers.length > 0) {
                orderExist = true;
            }

            if (!this.booking.cart) {
                this.displayMessage('You didn\'t select any flights!');
                this.router.navigateByUrl('/');
            }

            for (let i = 0; i < this.booking.cart.passengers.length; i++) {
                this.genderTouched[i] = false;
                this.passengerIds.push(this.booking.cart.passengers[i].personality.id);
            }
        } else {
            this.displayMessage('You didn\'t select any flights!');
            this.router.navigateByUrl('/');
        }


        if (!orderExist) {
            this.booking.cart.passengers.forEach(passenger => {
                this.createPassengerForm(passenger.personality.passengerTypeCode);
            });

            this.createContactForm(new ContactFormData());

            const frequentFlyerCardFormData: any = {
                corporateNumber: ''
            };
            this.createFrequentFlyerCardForm(frequentFlyerCardFormData);
        } else {
            this.getExistingForm();
        }

        this.globalLoading = false;
    }

    isMobile = false;
    contactsForm: FormGroup;
    frequentFlyerCardForm: FormGroup;
    minDate = new Date();
    offerId: string;

    booking: any;
    passengersForms: FormGroup[] = [];
    globalLoading = true;

    gender: string;
    genderList: string[] = [];

    isDesktop = false;
    isTablet = false;
    passenger = new Passenger();
    passengerIds: string[] = [];
    passengers: Personality[] = [];
    passengersSubject = new BehaviorSubject<any>([]);
    subscriptionState: Subscription = new Subscription();

    nomadErrorMsg;
    membershipErrorMsg;
    checkedList: boolean[] = [];
    submitted = false;
    allDataValid = [];
    el = document.getElementById('errorTextDiv');

    docTypes: Sourse[] = [
        {
            value: 'Passport', viewValue: 'Passport'
        },
        {
            value: 'IdentificationCard', viewValue: 'Identification card'
        }
    ];

    programs: Sourse[] = [
        {
            value: 'KC', viewValue: 'Air Astana'
        },
        {
            value: 'Asiana Airlines', viewValue: 'Asiana Airlines'
        },
        {
            value: 'Lufthansa', viewValue: 'Lufthansa'
        }
    ];

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';
    phoneError: boolean;
    genderTouched: boolean[] = [];
    searchRequest: any;
    errorMessage = false;
    errorText: string;
    locale;


    separateDialCode = false;
    SearchCountryField = SearchCountryField;
    TooltipLabel = TooltipLabel;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.Kazakhstan];
    // phoneForm = new FormGroup({
    //     phone: new FormControl(undefined, [Validators.required])
    // });


    public static convertV2(str) {
        if (str.year !== undefined) {
            const m = ('0' + str.month).slice(-2);
            const d = ('0' + str.day).slice(-2);
            return [str.year, m, d].join('-');
        }

        // tslint:disable-next-line:one-variable-per-declaration
        const date = new Date(str),
            mnth = ('0' + date.getMonth()).slice(-2),
            day = ('0' + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join('-');
    }

    static customValidatorINF: ValidatorFn = (ac): ValidationErrors => {
        const timeDiff = Math.abs(Date.now() - ac.value);
        const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
        if (age > 2) {
            return {infAge: true}
        } else {
            return null;
        }
    };
    static customValidatorCHD: ValidatorFn = (ac): ValidationErrors => {
        let depDate: Date = new Date();
        const conste: CryptoService = new CryptoService();
        const booking2 = conste.decryptData(localStorage.getItem('booking'));
        if (booking2.cart.offers) {
            depDate = new Date(booking2.cart.offers[0].bounds[0].flights[0].details.departure.dateTime);
        }
        const timeDiff = Math.abs(depDate.valueOf() - ac.value);
        const age = Math.floor(((timeDiff - 3 * 1000 * 3600 * 24) / (1000 * 3600 * 24)) / 365);
        if (age >= 12 || age <= 2)
            return {chdAgeLE12: true};
        else
            return null;
    };
    static customValidatorCHD2: ValidatorFn = (ac): ValidationErrors => {
        const timeDiff = Math.abs(Date.now() - ac.value);
        const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
        if ((age > 12 && age <= 14) || age >= 14)
            return {between112and14: true};
        else
            return null;
    };

    ngOnInit(): void {

        this.locale = this._translateService.currentLang;

        // console.log('locale', this.locale);

        // this._adapter.setLocale(this.locale);

        localStorage.setItem('state', State.PASSENGER_FULFILL_STATE.toString());
        this.route.params.subscribe(params => {
            this.offerId = params.offerId;
        });


        this.passengersSubject.asObservable().subscribe(passengers => {
            this.passengers = passengers;
        });
        this.subscriptionState = this.communicationService.passengerInfChangeObservable$.subscribe(state => {
            this.reloadPassengerDetails(state);
        });
    }

    ngAfterViewInit(): void {
        this.el = document.getElementById('errorTextDiv');
    }

    getExistingForm(): any {
        let i = 0;
        const frequentFlyerCardFormData: any = {};
        this.booking.cart.passengers.forEach(passenger => {
            const passengerFormData = new PassengerFormData(passenger.passengerTypeCode);
            passengerFormData.firstName = passenger.personality.firstName;
            passengerFormData.lastName = passenger.personality.lastName;
            passengerFormData.gender = passenger.personality.gender;
            passengerFormData.dateOfBirth = passenger.personality.dateOfBirth;
            passengerFormData.passengerTypeCode = passenger.personality.passengerTypeCode;
            passengerFormData.documentNumber = passenger.personality.documentNumber;

            this.genderTouched[i] = true;
            this.genderList[i] = passenger.personality.gender;

            if (passenger.frequentFlyerCard) {
                passengerFormData.membershipCheck = true;
                passengerFormData.membershipNumber = passenger.frequentFlyerCard.cardNumber;
                passengerFormData.program = passenger.frequentFlyerCard.companyCode;
                frequentFlyerCardFormData.corporateNumber = passenger.frequentFlyerCard.corporateCardNumber;
                this.checkedList[i] = true;
            }

            i++;

            this.formGroupFormation(passenger.personality.passengerTypeCode, passengerFormData);
        });

        const contactFormData = new ContactFormData();
        this.booking.order.contacts.forEach(contact => {
            if (contact.contactType === 'Email') {
                contactFormData.address = contact.address;
            } else if (contact.contactType === 'Phone') {
                contactFormData.phoneForm.code = contact.countryPhoneExtension;
                contactFormData.phoneForm.phone = contact.number;
            }
        });

        this.createContactForm(contactFormData);
        this.createFrequentFlyerCardForm(frequentFlyerCardFormData);
    }

    createPassengerForm(typeCode: string) {
        const passengersFormData = new PassengerFormData(typeCode);
        this.formGroupFormation(typeCode, passengersFormData);
    }

    formGroupFormation(typeCode: string, passengerFormData: any): void {
        const form: FormGroup = this.formBuilder.group({
            firstName: new FormControl(passengerFormData.firstName, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
            lastName: new FormControl(passengerFormData.lastName, [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
        });
        switch (typeCode) {
            case 'ADT':
                form.addControl('gender', new FormControl(passengerFormData.gender, Validators.required));
                form.addControl('documentType', new FormControl('', Validators.required));
                form.addControl('documentNumber', new FormControl(passengerFormData.documentNumber, [Validators.required, Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]+$'),
                    Validators.maxLength(25)]));
                form.addControl('membershipCheck', new FormControl(passengerFormData.membershipCheck));
                form.addControl('program', new FormControl(passengerFormData.program));
                form.addControl('membershipNumber', new FormControl(passengerFormData.membershipNumber));
                form.addControl('passengerTypeCode', new FormControl(typeCode));
                break;
            case 'CHD':
                form.addControl('gender', new FormControl(passengerFormData.gender, Validators.required));
                form.addControl('documentType', new FormControl('', Validators.required));
                form.addControl('documentNumber', new FormControl(passengerFormData.documentNumber, Validators.required));
                form.addControl('dateOfBirth', new FormControl(passengerFormData.dateOfBirth, Validators.required));
                form.addControl('membershipCheck', new FormControl(passengerFormData.membershipCheck));
                form.addControl('program', new FormControl(passengerFormData.program));
                form.addControl('membershipNumber', new FormControl(passengerFormData.membershipNumber));
                form.addControl('passengerTypeCode', new FormControl(typeCode));
                form.get('dateOfBirth').setValidators(PassengerDetailsComponent.customValidatorCHD);
                // form.get('dateOfBirth').setValidators(PassengerDetailsComponent.customValidatorCHD2);
                break;
            case 'INF':
                form.addControl('dateOfBirth', new FormControl(passengerFormData.dateOfBirth, Validators.required));
                form.addControl('membershipCheck', new FormControl(passengerFormData.membershipCheck));
                form.addControl('program', new FormControl(passengerFormData.program));
                form.addControl('membershipNumber', new FormControl(passengerFormData.membershipNumber));
                form.addControl('passengerTypeCode', new FormControl(typeCode));
                form.get('dateOfBirth').setValidators(PassengerDetailsComponent.customValidatorINF);
                break;
        }
        if (form !== null) {
            this.allDataValid.push(true);
            this.passengersForms.push(form);
            this.checkedList.push(false);
            this.passengers.push(new Personality(typeCode));
            this.passengersSubject.next(this.passengers);
        }
    }

    createContactForm(contactFormData: ContactFormData): void {
        this.contactsForm = this.formBuilder.group({
            email: new FormControl(contactFormData.address, [Validators.required, Validators.email]),
            phoneForm: new FormGroup({
                phone: new FormControl(contactFormData.phoneForm.phone, [Validators.required,
                    Validators.maxLength(30), Validators.minLength(2)]),
            })
        });
    }

    createFrequentFlyerCardForm(frequentFlyerCardFormData): void {
        this.frequentFlyerCardForm = this.formBuilder.group({
            nomadNumber: new FormControl(frequentFlyerCardFormData.corporateNumber, [Validators.minLength(9),
                Validators.maxLength(9), Validators.pattern('[0-9]*')])
        });
    }

    selectGender(gender: string, i) {
        this.genderTouched[i] = true;
        this.genderList[i] = gender;
        this.passengersForms[i].get('gender').setValue(gender);

    }

    show(i) {
        this.checkedList[i] = !this.checkedList[i];

        if (this.checkedList[i] === true) {
            this.passengersForms[i].controls['program'].setValidators([Validators.required]);
            this.passengersForms[i].controls['membershipNumber'].setValidators([Validators.required]);
        } else {
            this.passengersForms[i].controls['program'].setValue('');
            this.passengersForms[i].controls['membershipNumber'].setValue('');
            this.passengersForms[i].controls['program'].setValidators([]);
            this.passengersForms[i].controls['program'].updateValueAndValidity();
            this.passengersForms[i].controls['membershipNumber'].setValidators([]);
            this.passengersForms[i].controls['membershipNumber'].updateValueAndValidity();
            this.passengersForms[i].controls['membershipNumber'].markAsUntouched();
            this.passengersForms[i].controls['program'].markAsUntouched();
            this.passengersForms[i].controls['membershipNumber'].markAsPristine();
            this.passengersForms[i].controls['program'].markAsPristine();
        }
    }

    onInputClick(event) {
        event.stopPropagation();
        if ((this.contactsForm.get('phone').get('number').touched || this.contactsForm.get('phone').get('number').dirty)
            && !this.contactsForm.get('phone').get('number').value || this.contactsForm.get('phone').get('number').hasError('required')
            || this.contactsForm.get('phone').get('number').hasError('maxlength') || this.contactsForm.get('phone').get('code').hasError('required')
            || this.contactsForm.get('phone').get('number').hasError('minlength')
            || this.contactsForm.get('phone').get('number').hasError('pattern')) {
            this.phoneError = true;
        } else if (this.contactsForm.get('phone').get('number').value && !this.contactsForm.get('phone').get('number').hasError('required')
            && !this.contactsForm.get('phone').get('number').hasError('maxlength') && !this.contactsForm.get('phone').get('code').hasError('required')
            && !this.contactsForm.get('phone').get('number').hasError('minlength')
            && !this.contactsForm.get('phone').get('number').hasError('pattern')) {
            this.phoneError = false;
        }
    }

    checkPhone() {
        if ((this.contactsForm.get('phone').get('number').touched || this.contactsForm.get('phone').get('number').dirty)
            && !this.contactsForm.get('phone').get('number').value || this.contactsForm.get('phone').get('number').hasError('required')
            || this.contactsForm.get('phone').get('number').hasError('maxlength') || this.contactsForm.get('phone').get('code').hasError('required')
            || this.contactsForm.get('phone').get('number').hasError('minlength')
            || this.contactsForm.get('phone').get('number').hasError('pattern')) {
            this.phoneError = true;
        } else if (this.contactsForm.get('phone').get('number').value && !this.contactsForm.get('phone').get('number').hasError('required')
            && !this.contactsForm.get('phone').get('number').hasError('maxlength') && !this.contactsForm.get('phone').get('code').hasError('required')
            && !this.contactsForm.get('phone').get('number').hasError('minlength')
            && !this.contactsForm.get('phone').get('number').hasError('pattern')) {
            this.phoneError = false;
        } else {
            this.phoneError = false;
        }
    }

    async reloadPassengerDetails($event: any) {

        // console.log('this.contactsForm.get).value');
        // console.log(this.contactsForm.get('phoneForm').get('phone').value);
        // console.log(this.contactsForm.get('phoneForm').get('phone').value.e164Number);
        this.errorMessage = false;
        this.errorText = null;
        if (this.genderList.length === 0) {
            for (let i = 0; i < this.booking.cart.passengers.length; i++) {
                this.genderTouched[i] = true;
            }
        }

        // if (this.phoneError === undefined) {
        //     this.phoneError = true;
        // }

        if (this.genderTouched) {
            if (!this.booking.order) {
                localStorage.setItem('index', '2');
                const updateCartRequest = new CartRequest();
                updateCartRequest.offerId = this.booking.cart.offers[0].id;
                updateCartRequest.passengers = [];

                this.contactsForm.markAllAsTouched();

                let fullFilled = true;
                for (let i = 0; i < this.passengersForms.length; i++) {
                    this.passengersForms[i].markAllAsTouched();
                    if (this.passengersForms[i].valid) {
                        if (this.contactsForm.valid) {
                            const newPassenger = new Passenger();
                            newPassenger.personality = this.passengersForms[i].getRawValue();
                            if (this.passengersForms[i].get('dateOfBirth')) {
                                // let date = new Date(this.passengersForms[i].get('dateOfBirth').value);
                                // date.setMinutes(date.getTimezoneOffset());
                                // newPassenger.personality.dateOfBirth = date.toString();
                                // console.log('dateOfBirth');
                                // console.log(this.passengersForms[i].get('dateOfBirth').value)
                                // let date: moment.Moment = this.passengersForms[i].get('dateOfBirth').value;
                                // date = moment(date, 'DD-MM-YYYY').add(1, 'days');
                                // console.log('this.passengersForms[i].get(dateOfBirth).value')
                                // console.log(this.passengersForms[i].get('dateOfBirth').value)
                                // console.log('PassengerDetailsComponent.convertV2(this.passengersForms[i].get(dateOfBirth).value)')
                                // console.log(PassengerDetailsComponent.convertV2(this.passengersForms[i].get('dateOfBirth').value))
                                newPassenger.personality.dateOfBirth = PassengerDetailsComponent.convertV2(this.passengersForms[i].get('dateOfBirth').value) + 'T00:00:00.000Z'; // Saule
                            } else {
                                newPassenger.personality.dateOfBirth = '1980-01-01';
                            }

                            newPassenger.personality.id = this.passengerIds[i];
                            if (this.passengers[i].passengerTypeCode === 'INF') {
                                // tslint:disable-next-line:max-line-length
                                newPassenger.personality.accompanyingTravelerId = this.booking.cart.passengers[i].personality.accompanyingTravelerId;
                            }

                            newPassenger.personality.passengerTypeCode = this.passengers[i].passengerTypeCode;
                            const contactEmail = new Email();
                            contactEmail.category = 'personal';
                            contactEmail.address = this.contactsForm.getRawValue().email;
                            contactEmail.contactType = 'email';

                            const contactPhone = new Phone();
                            contactPhone.category = 'personal';
                            // const phoneCode = this.contactsForm.get('phone').get('code').value;

                            const phoneNumber = (this.contactsForm.get('phoneForm').get('phone').value.e164Number).replace('+', '');
                            // console.log(phoneNumber);
                            contactPhone.number = phoneNumber;
                            contactPhone.contactType = 'phone';
                            const nomadNumber = this.frequentFlyerCardForm.get('nomadNumber').value;
                            const membershipNumber = newPassenger.personality['membershipNumber'];
                            const companyCode = newPassenger.personality['program'];
                            if (nomadNumber || membershipNumber) {
                                const frequentFlyerCard = new FrequentFlyerCard();
                                frequentFlyerCard.cardNumber = membershipNumber && membershipNumber !== '' ? membershipNumber : null;
                                frequentFlyerCard.companyCode = companyCode && companyCode !== '' ? companyCode : null;
                                frequentFlyerCard.corporateCardNumber = nomadNumber && nomadNumber !== '' ? nomadNumber : null;
                                newPassenger.frequentFlyerCard = frequentFlyerCard;
                            } else {
                                newPassenger.frequentFlyerCard = null;
                                // console.log(newPassenger.frequentFlyerCard); TODO
                                this.passengersForms[i].controls['membershipCheck'] = new FormControl(false);
                            }

                            newPassenger.contacts = [];
                            newPassenger.contacts.push(contactEmail);
                            newPassenger.contacts.push(contactPhone);
                            updateCartRequest.passengers.push(newPassenger);
                        }
                    } else {
                        const firstElementWithError = document.querySelector('.ng-invalid');
                        if (firstElementWithError) {
                            firstElementWithError.scrollIntoView({behavior: 'smooth'});
                        }
                        this.allDataValid[i] = false;
                        fullFilled = false;
                        if (this.checkedList[i]) {
                            this.passengersForms[i].controls['program'].setValidators([]);
                            this.passengersForms[i].controls['program'].updateValueAndValidity();
                            this.passengersForms[i].controls['membershipNumber'].setValidators([]);
                            this.passengersForms[i].controls['membershipNumber'].updateValueAndValidity();
                            this.passengersForms[i].controls['program'] = new FormControl('');
                            this.passengersForms[i].controls['membershipNumber'] = new FormControl('');
                            this.passengersForms[i].controls['membershipNumber'].markAsUntouched();
                            this.passengersForms[i].controls['program'].markAsUntouched();
                            this.passengersForms[i].controls['membershipNumber'].markAsPristine();
                            this.passengersForms[i].controls['program'].markAsPristine();
                        }
                    }

                }

                this.submitted = true;

                if (fullFilled) {
                    const lastName = this.passengersForms[0].getRawValue().lastName;
                    if (!this.contactsForm.get('phoneForm').get('phone').invalid) {
                        this.globalLoading = true;
                        this.cartService.updateCart(this.booking.cart.id, updateCartRequest, lastName).subscribe(cartResult => {
                            if (cartResult.errors) {
                                this.displayMessage(cartResult.errors[0].detail);
                                this.globalLoading = false;
                            } else {
                                this.booking.cart = cartResult.data;
                                this.booking.lastName = lastName;

                                for (let i = 0; i < this.passengersForms.length; i++) {
                                    if (this.booking.cart.passengers[i].personality.firstName === this.passengersForms[i].getRawValue().firstName &&
                                        this.booking.cart.passengers[i].personality.lastName === this.passengersForms[i].getRawValue().lastName) {
                                        if (this.passengersForms[i].getRawValue().documentNumber !== null)
                                            this.booking.cart.passengers[i].personality.documentNumber = this.passengersForms[i].getRawValue().documentNumber;
                                    }
                                    if (!this.checkedList[i]) {
                                        this.booking.cart.passengers[i].frequentFlyerCard = null;
                                    }
                                }
                                let state = localStorage.getItem('state');
                                localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));

                                this.orderService.createOrder(this.booking.cart, lastName).subscribe(orderResult => {
                                    if (orderResult.data) {
                                        this.booking.order = orderResult.data;
                                        localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
                                        if (state === State.PASSENGER_FULFILL_STATE.toString()) {
                                            state = State.SERVICE_SELECTION_STATE.toString();
                                            localStorage.setItem('state', state);
                                            this.router.navigateByUrl('/services');
                                        }
                                        this.communicationService.bookingChange(this.booking);
                                    } else if (orderResult.errors) {
                                        this.nomadErrorMsg = orderResult.errors[0].title;
                                        this.membershipErrorMsg = orderResult.errors[0].title;
                                        this.displayMessage(this.membershipErrorMsg)
                                    }
                                    this.globalLoading = false;
                                }, (orderError) => {
                                    this.membershipErrorMsg = orderError.error.errors[0].title;
                                    this.displayMessage(this.membershipErrorMsg);
                                    this.globalLoading = false;
                                });
                            }
                        }, error => {
                            if (error.error && error.error.errors) {
                                this.membershipErrorMsg = error.error.errors[0].title;
                            }
                            this.displayMessage('Error occurred! Please reload page!');
                            this.globalLoading = false;
                        });
                    }
                } else {
                    this.displayMessage('The form is invalid! Please recheck!');
                }

                // this.globalLoading = false;

            } else {
                this.router.navigateByUrl('/services');
            }

            // this.globalLoading = false;
        }
    }

    // handleError(error) {
    //     let errorMessage = '';
    //     if (error.error instanceof ErrorEvent) {
    //         // client-side error
    //         errorMessage = `Error: ${error.error.message}`;
    //     } else {
    //         // server-side error
    //         errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    //     }
    //     window.alert(errorMessage);
    //     return throwError(errorMessage);
    // }

    getTypeName(code: string): string {
        switch (code) {
            case 'ADT':
                return 'Adult';
            case 'CHD':
                return 'Child';
            case 'INF':
                return 'Infant';
        }
    }

    displayMessage(text: string): void {
        this.errorMessage = true;
        this.errorText = text;
        if (this.errorText && this.checkValidity()) {
            this.el.scrollIntoView();
        }
        // this._snackBar.open(text, '', {
        //     duration: 3000,
        //     horizontalPosition: this.horizontalPosition,
        //     verticalPosition: this.verticalPosition,
        // });
    }

    checkValidity() {
        for (const form of this.passengersForms) {
            if (form.invalid) {
                return false;
            }
        }
        return true;
    }
}

interface Sourse {
    value: string;
    viewValue: string;
}
