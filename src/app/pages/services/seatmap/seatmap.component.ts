import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {SidebarComponent} from '../../../../@vex/components/sidebar/sidebar.component';
import {IconService} from '../../../../@vex/services/icon.service';
import {CommunicationService} from '../../../../@vex/services/communication/communication.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {OrderService} from '../../../shared/api/order.service';
import {MatDialog} from '@angular/material/dialog';
import {SeatmapService} from '../../../shared/api/seatmap.service';
import {CryptoService} from '../../../utils/crypto.service';
import {FlightContainer} from '../../../shared/models/flight/flight-container';
import {Images} from '../../../shared/constants/images';
import {SeatmapSeatProperties} from '../../../shared/models/seatmap/seatmap-seat-properties';
import {SeatInfoDialogComponent} from './seat-info-dialog/seat-info-dialog.component';

@Component({
    selector: 'vex-seatmap',
    templateUrl: './seatmap.component.html',
    styleUrls: ['./seatmap.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SeatmapComponent implements OnInit, OnDestroy {

    flight: FlightContainer;
    seatmap: any;
    counter = 0;
    counter2 = 0;
    marginTop = 0;

    serviceContent: any = {};
    serviceContentFirst: any = {};
    booking: any;
    flightId: string;

    totalPrice: any = {};

    coordinates = {};
    rows = [];
    columns = [];

    startWings: any;
    endWings: any;
    wingsHeight: any;

    isEconom = true;
    isMobile: boolean;
    globalLoading = false;

    letters: any = {};
    firstRow: number;
    lettersKeys: any[] = [];
    width: any[] = [];
    currency;

    currentUserSeats = [];
    previousSeat: any;

    @Output() close = new EventEmitter<any>();
    @ViewChild('configpanel', {static: true}) configpanel: SidebarComponent;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    private _unsubscribeAll: Subject<any>;


    constructor(
        public _iconService: IconService,
        public communicationService: CommunicationService,
        private _deviceDetectorService: DeviceDetectorService,
        private orderService: OrderService,
        public dialog: MatDialog,
        private seatmapService: SeatmapService,
        private _snackBar: MatSnackBar,
        private _cryptoService: CryptoService
    ) {
        this._unsubscribeAll = new Subject<any>();
        this.isMobile = this._deviceDetectorService.isMobile();
    }

    ngOnInit(): void {
        this.communicationService.seatSelectBtnObservable$.subscribe(flight => {
            // console.log('called0');

            this.globalLoading = true;
            this.flight = flight;
            if (localStorage.getItem('serviceContent')) {
                this.serviceContent = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));
                this.serviceContentFirst = this._cryptoService.decryptData(localStorage.getItem('serviceContent'));

                if (!this.serviceContent['seatmap']) {
                    this.serviceContent['seatmap'] = {};
                    this.serviceContentFirst['seatmap'] = {};
                }
            }

            if (localStorage.getItem('booking')) {
                this.booking = this._cryptoService.decryptData(localStorage.getItem('booking'));
                this.getOrder();
            } else {
                this.displayMessage('Бронь не зарегистрирована!');
            }

        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    getOrder() {
        this.globalLoading = true;

        if (this.booking.order) {
            const flightDetails = this.flight.details;
            this.booking.order.air.bounds.forEach(orderBound => {
                orderBound.flights.forEach(flight => {
                    if (flight.departure === flightDetails.departure.cityCode && flight.arrival === flightDetails.arrival.cityCode) {
                        this.flightId = flight.id;

                        if (this.serviceContent && !this.serviceContent['seatmap']) {
                            this.serviceContent['seatmap'] = {};
                            this.serviceContentFirst['seatmap'] = {};
                        }

                        if (!this.serviceContent['seatmap'][this.flightId]) {
                            this.serviceContent['seatmap'][this.flightId] = {};
                            this.serviceContentFirst['seatmap'][this.flightId] = {};
                        }

                        if (this.serviceContent['seatmap'] && this.serviceContent['seatmap'][this.flightId]) {
                            const passengerIds = Object.keys(this.serviceContent['seatmap'][this.flightId]);
                            passengerIds.forEach(passengerId => {
                                this.currentUserSeats.push(this.serviceContent['seatmap'][this.flightId][passengerId].seatNumber);
                            });
                        }


                        if (this.booking.order.seats) {
                            this.totalPrice[this.flightId] = this.calculateTotal(this.booking.order.seats);
                        } else {
                            this.totalPrice[this.flightId] = 0;
                        }
                    }
                });
            });
            this.getSeatmap();
        }
    }

    getSeatmap() {
        this.rows = [];
        this.columns = [];

        this.seatmapService.getSeatmap(this.booking.order.id, this.booking.lastName, this.flightId).subscribe(res => {
            this.seatmap = res.data;
            this.currency = this.seatmap.seatmapDescriptions[0].decks[0].seats[0].travelers[0].prices[0].currencyCode;
            this.startWings = this.seatmap.seatmapDescriptions[0].decks[0].deckDimensions.startWingsX;
            this.endWings = this.seatmap.seatmapDescriptions[0].decks[0].deckDimensions.endWingsX;

            // console.log(this.startWings);
            // console.log(this.endWings);

            this.coordinates = {};

            const deckDimensions = this.seatmap.seatmapDescriptions[0].decks[0].deckDimensions;
            deckDimensions.exitRowsX.forEach(exitRow => {
                if (!this.coordinates[exitRow]) {
                    this.coordinates[exitRow] = {}
                }
                this.coordinates[exitRow][0] = 'exit';
                this.coordinates[exitRow][deckDimensions.width - 1] = 'exit';
            });

            const facilities = this.seatmap.seatmapDescriptions[0].decks[0].facilities;
            facilities.forEach(facility => {
                if (!this.coordinates[facility.coordinates.x]) {
                    this.coordinates[facility.coordinates.x] = {};
                }
                this.coordinates[facility.coordinates.x][facility.coordinates.y] = facility.code;
            });

            const seats = this.seatmap.seatmapDescriptions[0].decks[0].seats;
            seats.forEach(seat => {
                if (!this.coordinates[seat.coordinates.x]) {
                    this.coordinates[seat.coordinates.x] = {};
                }
                this.coordinates[seat.coordinates.x][seat.coordinates.y] = {
                    type: 'seat',
                    seat,
                    passengerInitials: ''
                };

                this.getPassengerInitials(seat.seatNumber, seat.coordinates.x, seat.coordinates.y);
            });

            // seats.forEach(seat => {
            //     this.getPassengerInitials(seat.seatNumber, seat.coordinates.x, seat.coordinates.y);
            // });


            // console.log('coor AFTER')
            // console.log(this.coordinates)


            this.rows = Object.keys(this.coordinates);

            for (let i = 0; i < this.seatmap.seatmapDescriptions[0].decks[0].deckDimensions.width; i++) {
                this.columns.push(i + 1);
            }

            this.globalLoading = false;

            // console.log(this.coordinates);
            this.countHeight();
            this.getLetters();

        });
    }

    selectSeat(seat: SeatmapSeatProperties) {
        let status = 'blocked';
        for (const avalability of seat.travelers) {
            if (avalability.seatAvailabilityStatus === 'available') {
                status = 'available';
                break;
            }
        }
        if (status !== 'blocked' && status !== 'occupied') {
            // console.log('this.serviceContent', this.serviceContent);
            const dialogRef = this.dialog.open(SeatInfoDialogComponent, {
                width: '450px',
                data: {
                    seat,
                    order: this.booking.order,
                    flight: this.flight,
                    flightId: this.flightId,
                    seatmapInfo: JSON.parse(JSON.stringify(this.serviceContent['seatmap'][this.flightId])),
                    currency: this.currency
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {

                    if (localStorage.getItem('oldSeat')) {
                        this.previousSeat = this._cryptoService.decryptData(localStorage.getItem('oldSeat'));
                        this.coordinates[this.previousSeat.row][this.previousSeat.column].passengerInitials = '';
                        localStorage.removeItem('oldSeat');
                    }

                    if (localStorage.getItem('oldSeat3')) {
                        this.previousSeat = this._cryptoService.decryptData(localStorage.getItem('oldSeat3'));
                        this.coordinates[this.previousSeat.row][this.previousSeat.column].passengerInitials = '';
                        localStorage.removeItem('oldSeat3');
                    }
                    this.serviceContent['seatmap'][this.flightId] = JSON.parse(JSON.stringify(result));

                    this.totalPrice[this.flightId] = 0;

                    this.booking.order.passengers.forEach(passenger => {

                        if (this.serviceContent['seatmap'][this.flightId][passenger.id]) {
                            const seatInfo = this.serviceContent['seatmap'][this.flightId][passenger.id];
                            this.totalPrice[this.flightId] += seatInfo.price;
                        }

                        if (result[passenger.id]) {
                            this.coordinates[result[passenger.id].row][result[passenger.id].column].passengerInitials = result[passenger.id].initials;
                        }

                    });

                    // console.log(this.coordinates);
                    // console.log(this.serviceContent['seatmap']);
                    // console.log('result',result);

                    this.booking.order.passengers.forEach(passenger => {
                        const newContent = this.serviceContent['seatmap'][this.flightId];
                        const oldContent = this.serviceContentFirst['seatmap'][this.flightId];
                        // console.log('newContent', newContent)
                        // console.log('oldContent', oldContent)

                        if (newContent && oldContent && newContent[passenger.id] && oldContent[passenger.id]) {
                            const newSeat = newContent[passenger.id];
                            const oldSeat = oldContent[passenger.id];

                            if (oldSeat.seatNumber !== newSeat.seatNumber) {
                                this.coordinates[oldSeat.row][oldSeat.column].passengerInitials = '';
                                this.coordinates[oldSeat.row][oldSeat.column].seat.travelers.forEach(traveler => {
                                    if (traveler.id === passenger.id) {
                                        // this.coordinates[oldSeat.row][oldSeat.column].seat.travelers[i].seatAvailabilityStatus = 'available'
                                        traveler.seatAvailabilityStatus = 'available';
                                        this.serviceContentFirst['seatmap'][this.flightId] = JSON.parse(JSON.stringify(result));
                                    }
                                });
                                this.coordinates[result[passenger.id].row][result[passenger.id].column].passengerInitials = result[passenger.id].initials;
                            }
                        }

                    });


                }


            });


        }
    }

    getPassengerInitials(seatNumber: string, row?: string, column?: string) {
        const passengerIds = Object.keys(this.serviceContent['seatmap'][this.flightId]);

        passengerIds.forEach(passengerId => {

            if (this.serviceContent['seatmap'][this.flightId] && this.serviceContent['seatmap'][this.flightId][passengerId] &&
                (this.serviceContent['seatmap'][this.flightId][passengerId].seatNumber === seatNumber)) {
                if (row != null && column != null) {
                    this.coordinates[row][column].passengerInitials = this.serviceContent['seatmap'][this.flightId][passengerId].initials;
                }
                return this.serviceContent['seatmap'][this.flightId][passengerId].initials;
            }
            return '';
        });

        return '';
    }


    countHeight() {
        this.counter = 0;
        this.counter2 = 0;
        this.marginTop = 0;
        this.wingsHeight = 0;
        this.startWings = this.seatmap.seatmapDescriptions[0].decks[0].deckDimensions.startWingsX;
        this.endWings = this.seatmap.seatmapDescriptions[0].decks[0].deckDimensions.endWingsX;
        for (const key of Object.keys(this.coordinates)) {
            if (+key < this.endWings && +key < this.startWings) {
                this.counter2++;
            }
            if (+key >= this.startWings && +key <= this.endWings) {
                this.counter++;
            }
        }
        this.wingsHeight = this.counter * 48;
        this.marginTop = (this.counter2 + 1) * 48;
    }


    async saveSeats() {
        this.globalLoading = true;

        const seatSelections = [];
        this.booking.order.passengers.forEach(passenger => {
            const seatInfo = this.serviceContent['seatmap'][this.flightId][passenger.id];
            if (seatInfo) {
                seatSelections.push({
                    seatNumber: seatInfo.seatNumber,
                    travelerId: seatInfo.travelerId
                });
            }
        });

        const requestBody: any = {};
        requestBody.seats = [{flightId: this.flightId, seatSelections}];

        let sendToSave = true;

        for (const passenger of this.booking.order.passengers) {
            const seatInfo = this.serviceContent['seatmap'][this.flightId][passenger.id];

            if (this.booking.order.seats) {
                for (const seat of this.booking.order.seats) {
                    if (seat.flightId === this.flightId) {
                        for (const seatSelection of seat.seatSelections) {
                            if (seatSelection.travelerId === passenger.id && seatSelection.seatNumber !== seatInfo.seatNumber) {
                                sendToSave = false;
                            }
                        }

                    }
                }
            }
        }

        // console.log('requestBody', requestBody);

        if (sendToSave) {

            if (this.booking.order && this.booking.order.seats) {
                for (const seat of this.booking.order.seats) {
                    for (const seat1 of requestBody.seats) {
                        if (seat.flightId === seat1.flightId) {
                            for (const i of seat.seatSelections) {
                                for (const j of seat1.seatSelections) {
                                    if (i.seatNumber === j.seatNumber && i.travelerId === j.travelerId) {
                                        const index = seat1.seatSelections.indexOf(j);
                                        seat1.seatSelections.splice(index, 1);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // console.log('requestBody', requestBody);
            this.saveAndEmit(requestBody);
        } else {
            this.deleteAndSaveSeats(requestBody);
        }
    }


    saveAndEmit(requestBody) {
        this.globalLoading = true;
        this.seatmapService.addSeatToOrder(this.booking.order.id, requestBody, this.booking.lastName).subscribe(response => {

            if (response.data) {
                //  Add booked seats to service content map in the local storage
                localStorage.setItem('serviceContent', this._cryptoService.encryptData(this.serviceContent));
                localStorage.setItem('serviceContent2', JSON.stringify(this.serviceContent));
            }

            // Get order after seat addition
            this.orderService.getOrder(this.booking.order.id, this.booking.lastName).subscribe(res => {
                if (res.data) {
                    this.booking.order = res.data;
                    this.currentUserSeats = [];
                    localStorage.setItem('booking', this._cryptoService.encryptData(this.booking));
                    localStorage.setItem('booking2', this.booking);

                    this.globalLoading = false;
                    this.close.emit(this.booking);
                }
            });

        });
    }

    async deleteAndSaveSeats(requestBody) {
        this.globalLoading = true;
        for (const seat of this.booking.order.seats) {
            if (seat.flightId === this.flightId) {
                await this.seatmapService.deleteSpecificSeatFromOrder(this.booking.order.id, seat.id, this.booking.lastName).toPromise();
            }
        }

        this.saveAndEmit(requestBody);
    }


    mouseOverEvent(id: string, row: number, col: number) {
        const htmlElement = document.getElementById(id);
        htmlElement.setAttribute('style', 'background-image: url(\".' + this.getImage(row, col, 'hover') + '\"); display: flex; justify-content: center; align-items: center;)');
    }

    mouseLeaveEvent(id: string, row: number, col: number) {
        const htmlElement = document.getElementById(id);
        htmlElement.setAttribute('style', 'background-image: url(\".' + this.getImage(row, col, 'available') + '\"); display: flex; justify-content: center; align-items: center;)');
    }

    hasCharacteristicCode(row: number, col: number, code: string): boolean {
        const seatInfo = this.coordinates[row][col];
        if (seatInfo && seatInfo.seat && seatInfo.seat.travelers && seatInfo.seat.travelers.length > 0) {
            return this.coordinates[row][col].seat.travelers[0].seatCharacteristicsCodes.includes(code);
        }
        return false;
    }

    hasStatus(row: number, col: number, status: string): boolean {
        let result = false;
        const seatInfo = this.coordinates[row][col];
        if (seatInfo && seatInfo.seat && seatInfo.seat.travelers && seatInfo.seat.travelers.length > 0) {
            this.coordinates[row][col].seat.travelers.forEach(traveler => {
                if (traveler.seatAvailabilityStatus === status) {
                    result = true;
                }
            });
        }
        return result;
    }

    getImage(row: number, col: number, code: string): string {

        // console.log('code ' + code);
        let imageSrc = '';

        const isChargeable = this.hasCharacteristicCode(row, col, 'CH');
        const isAvailable = this.hasStatus(row, col, 'available');
        const isOccupied = this.hasStatus(row, col, 'occupied');
        const isBlocked = this.hasStatus(row, col, 'blocked');

        if (code === 'hover') {
            if (this.coordinates[row][col].seat && this.coordinates[row][col].seat.cabin === 'eco') {
                this.isEconom = true;
                if (isChargeable && isAvailable) {
                    imageSrc = Images.ECO_BIG_SEAT_HOVER;
                } else if (isChargeable && isOccupied) {
                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        // imageSrc = Images.ECO_BIG_SEAT_DISABLED;
                        imageSrc = Images.ECO_BIG_SEAT_HOVER;

                    } else {
                        // imageSrc = Images.ECO_BIG_SEAT_HOVER;
                        imageSrc = Images.ECO_BIG_SEAT_DISABLED;

                    }
                    // imageSrc = Images.ECO_BIG_SEAT_HOVER;
                } else if (isChargeable && isBlocked) {
                    imageSrc = Images.ECO_BIG_SEAT_DISABLED;
                }

                if (!isChargeable && isAvailable) {
                    imageSrc = Images.ECO_SEAT_HOVER;
                } else if (!isChargeable && isOccupied) {
                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        // imageSrc = Images.ECO_BIG_SEAT_DISABLED;
                        imageSrc = Images.ECO_SEAT_HOVER;

                    } else {
                        // imageSrc = Images.ECO_BIG_SEAT_HOVER;
                        imageSrc = Images.ECO_SEAT_DISABLED;

                    }
                    // imageSrc = Images.ECO_SEAT_HOVER;
                } else if (!isChargeable && isBlocked) {
                    imageSrc = Images.ECO_SEAT_DISABLED;
                }
            } else if (this.coordinates[row][col].seat && this.coordinates[row][col].seat.cabin === 'business') {
                this.isEconom = false;

                if (isChargeable && isAvailable) {
                    imageSrc = Images.BUSINESS_SEAT_HOVER;
                } else if (isChargeable && isOccupied) {
                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.BUSINESS_SEAT_HOVER;

                    } else {
                        imageSrc = Images.BUSINESS_SEAT_DISABLED;

                    }
                    // imageSrc = Images.BUSINESS_SEAT_HOVER;
                } else if (isChargeable && isBlocked) {
                    imageSrc = Images.BUSINESS_SEAT_DISABLED;
                }

                if (!isChargeable && isAvailable) {
                    imageSrc = Images.BUSINESS_SEAT_HOVER;
                } else if (!isChargeable && isOccupied) {

                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.BUSINESS_SEAT_HOVER;

                    } else {
                        imageSrc = Images.BUSINESS_SEAT_DISABLED;

                    }
                    // imageSrc = Images.BUSINESS_SEAT_HOVER;
                } else if (!isChargeable && isBlocked) {
                    imageSrc = Images.BUSINESS_SEAT_DISABLED;
                }
            }
        } else if (code === 'available') {
            if (this.coordinates[row][col].seat && this.coordinates[row][col].seat.cabin === 'eco') {
                this.isEconom = true;
                if (isChargeable && isAvailable) {
                    imageSrc = Images.ECO_BIG_SEAT_AVAILABLE;
                } else if (isChargeable && isOccupied) {

                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        // imageSrc = Images.ECO_BIG_SEAT_DISABLED;
                        imageSrc = Images.ECO_BIG_SEAT_HOVER;

                    } else {
                        // imageSrc = Images.ECO_BIG_SEAT_HOVER;
                        imageSrc = Images.ECO_BIG_SEAT_DISABLED;

                    }
                } else if (isChargeable && isBlocked) {
                    imageSrc = Images.ECO_BIG_SEAT_DISABLED;
                }

                if (!isChargeable && isAvailable) {
                    imageSrc = Images.ECO_SEAT_AVAILABLE;
                } else if (!isChargeable && isOccupied) {
                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.ECO_SEAT_HOVER;

                        // imageSrc = Images.ECO_SEAT_DISABLED;
                    } else {
                        // imageSrc = Images.ECO_SEAT_HOVER;
                        imageSrc = Images.ECO_SEAT_DISABLED;

                    }
                } else if (!isChargeable && isBlocked) {
                    imageSrc = Images.ECO_SEAT_DISABLED;
                }
            } else if (this.coordinates[row][col].seat && this.coordinates[row][col].seat.cabin === 'business') {
                this.isEconom = false;

                if (isChargeable && isAvailable) {
                    imageSrc = Images.BUSINESS_SEAT_AVAILABLE;
                } else if (isChargeable && isOccupied) {

                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.BUSINESS_SEAT_HOVER;

                    } else {
                        imageSrc = Images.BUSINESS_SEAT_DISABLED;

                    }

                    // imageSrc = Images.BUSINESS_SEAT_HOVER;
                } else if (isChargeable && isBlocked) {
                    imageSrc = Images.BUSINESS_SEAT_HOVER;
                }

                if (!isChargeable && isAvailable) {
                    imageSrc = Images.BUSINESS_SEAT_AVAILABLE;
                } else if (!isChargeable && isOccupied) {

                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.BUSINESS_SEAT_HOVER;

                    } else {
                        imageSrc = Images.BUSINESS_SEAT_DISABLED;

                    }

                    // imageSrc = Images.BUSINESS_SEAT_DISABLED;
                } else if (!isChargeable && isBlocked) {
                    imageSrc = Images.BUSINESS_SEAT_DISABLED;
                }
            }
        } else {
            if (this.coordinates[row][col].seat && this.coordinates[row][col].seat.cabin === 'eco') {
                this.isEconom = true;
                if (isChargeable && isAvailable) {
                    imageSrc = Images.ECO_BIG_SEAT_AVAILABLE;
                } else if (isChargeable && isOccupied) {
                    // console.log('this.getPassengerInitials(this.coordinates[row][col].seat.seatNumber)');
                    // console.log(this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber));

                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.ECO_BIG_SEAT_HOVER;
                    } else {
                        // imageSrc = Images.ECO_BIG_SEAT_HOVER;
                        imageSrc = Images.ECO_BIG_SEAT_DISABLED;

                    }

                } else if (isChargeable && isBlocked) {
                    imageSrc = Images.ECO_BIG_SEAT_DISABLED;
                }

                if (!isChargeable && isAvailable) {
                    imageSrc = Images.ECO_SEAT_AVAILABLE;
                } else if (!isChargeable && isOccupied) {
                    // tslint:disable-next-line:triple-equals
                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.ECO_SEAT_HOVER;

                        // imageSrc = Images.ECO_SEAT_DISABLED;
                    } else {
                        // imageSrc = Images.ECO_SEAT_HOVER;
                        imageSrc = Images.ECO_SEAT_DISABLED;

                    }
                } else if (!isChargeable && isBlocked) {
                    imageSrc = Images.ECO_SEAT_DISABLED;
                }
            } else if (this.coordinates[row][col].seat && this.coordinates[row][col].seat.cabin === 'business') {
                this.isEconom = false;

                if (isChargeable && isAvailable) {
                    imageSrc = Images.BUSINESS_SEAT_AVAILABLE;
                } else if (isChargeable && isOccupied) {
                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.BUSINESS_SEAT_HOVER;

                    } else {
                        imageSrc = Images.BUSINESS_SEAT_DISABLED;

                    }

                    // imageSrc = Images.BUSINESS_SEAT_DISABLED;
                } else if (isChargeable && isBlocked) {
                    imageSrc = Images.BUSINESS_SEAT_DISABLED;
                }


                if (!isChargeable && isAvailable) {
                    imageSrc = Images.BUSINESS_SEAT_AVAILABLE;
                } else if (!isChargeable && isOccupied) {

                    if (this.currentUserSeats.includes(this.coordinates[row][col].seat.seatNumber)) {
                        imageSrc = Images.BUSINESS_SEAT_HOVER;

                    } else {
                        imageSrc = Images.BUSINESS_SEAT_DISABLED;

                    }
                    // imageSrc = Images.BUSINESS_SEAT_DISABLED;
                } else if (!isChargeable && isBlocked) {
                    imageSrc = Images.BUSINESS_SEAT_DISABLED;
                }
            }
        }

        const coordinate = this.coordinates[row][col];

        if (this.serviceContent && this.serviceContent['seatmap'] && this.serviceContent['seatmap'][this.flightId]) {
            const passengerIds = Object.keys(this.serviceContent['seatmap'][this.flightId]);
            passengerIds.forEach(passengerId => {
                const seatNumber = this.serviceContent['seatmap'][this.flightId][passengerId].seatNumber;

                if (coordinate && coordinate.seat && coordinate.seat.seatNumber === seatNumber) {
                    if (coordinate.seat.cabin === 'eco') {
                        this.isEconom = true;
                        if (isChargeable && isAvailable) {
                            imageSrc = Images.ECO_BIG_SEAT_HOVER;
                        }
                        if (!isChargeable && isAvailable) {
                            imageSrc = Images.ECO_SEAT_HOVER;
                        }
                    } else if (coordinate.seat.cabin === 'business') {
                        this.isEconom = false;
                        if (isChargeable && isAvailable) {
                            imageSrc = Images.BUSINESS_SEAT_HOVER;
                        }
                        if (!isChargeable && isAvailable) {
                            imageSrc = Images.BUSINESS_SEAT_HOVER;
                        }
                    }
                }
            });
        }

        return imageSrc;
    }


    calculateTotal(services: any): number {
        let total = 0;

        for (let i = 0; i < services.length; i++) {
            if (this.flightId === services[i].flightId && services[i].prices) {
                total += services[i].prices.totalPrices[0].total.value;
            }
        }
        return total;
    }

    closeSeatmap() {
        this.close.emit();
    }

    displayMessage(text: string): void {
        this._snackBar.open(text, '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

    getLetters() {
        const deck = this.seatmap.seatmapDescriptions[0].decks[0];
        const x = deck.firstAvailableSeat.x - 1;
        this.firstRow = x;

        this.letters = {};
        this.width = [];
        this.letters[x] = {};

        const filledLetters = [];
        for (const facility of this.seatmap.seatmapDescriptions[0].decks[0].facilities) {
            const y = facility.coordinates.y;

            if (!filledLetters.includes(facility.column)) {
                this.letters[x][y] = facility.column;
                filledLetters.push(facility.column);
            }
        }

        this.lettersKeys = Object.keys(this.letters[x]);

        for (let i = 0; i < deck.deckDimensions.width; i++) {
            this.width.push(i);
        }

        // this.lettersKeys = Object.keys(this.letters[x]);

        // console.log('letters', this.letters);
    }

    getPosition(row: any) {
        if (row.type === 'seat') {
            return row.seat.seatNumber.replace(/[a-zA-Z]/g, '');
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

    getAircraftWidth(): string {
        if (!this.isMobile) {
            if (this.isEconom) {
                return this.lettersKeys.length > 6 ? 'seatmap-econom-big' : 'seatmap-econom';
            } else {
                return 'seatmap-business';
            }
        } else {
            return '';
        }
    }

    getKeys(obj: any) {
        return obj ? Object.keys(obj) : 0;
    }
}
