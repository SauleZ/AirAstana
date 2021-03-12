import {Component, Inject, OnInit} from '@angular/core';
import {SeatmapSeatProperties} from '../../../../shared/models/seatmap/seatmap-seat-properties';
import {FlightContainer} from '../../../../shared/models/flight/flight-container';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IconService} from '../../../../../@vex/services/icon.service';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {DeviceDetectorService} from 'ngx-device-detector';
import {CommunicationService} from '../../../../../@vex/services/communication/communication.service';
import {CryptoService} from '../../../../utils/crypto.service';

@Component({
    selector: 'vex-seat-info-dialog',
    templateUrl: './seat-info-dialog.component.html',
    styleUrls: ['./seat-info-dialog.component.scss']
})
export class SeatInfoDialogComponent implements OnInit {

    seat: SeatmapSeatProperties;
    order: any;
    flight: FlightContainer;
    flightId: string;
    seatmapInfo: any;
    serviceContent: any;
    currency;

    isMobile = false;
    isDesktop = false;
    isTablet = false;

    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top';

    constructor(
        public dialogRef: MatDialogRef<SeatInfoDialogComponent>,
        public iconsService: IconService,
        public communicationService: CommunicationService,
        public _iconService: IconService,
        private _snackBar: MatSnackBar,
        private _cryptoService: CryptoService,
    private detectorService: DeviceDetectorService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.seat = data.seat;
        this.order = data.order;
        this.flight = data.flight;
        this.flightId = data.flightId;
        this.seatmapInfo = data.seatmapInfo;
        this.currency = data.currency;

        this.isMobile = this.detectorService.isMobile();
        this.isDesktop = this.detectorService.isDesktop();
        this.isTablet = this.detectorService.isTablet();
    }

    ngOnInit(): void {
    }

    selectPassenger(passenger: any) {
        // console.log('passenger', passenger);
        const status = this.getSeatPriceAndStatus(passenger);
        // console.log('status 666666666666666666', status);


        if (status.available) {
            const passengerSeatInfo = {
                seatNumber: this.seat.seatNumber,
                travelerId: passenger.id,
                row: this.seat.coordinates.x,
                column: this.seat.coordinates.y,
                price: status.price,
                initials: passenger.names[0].firstName.charAt(0) + passenger.names[0].lastName.charAt(0)
            };

            this.seatmapInfo[passenger.id] = passengerSeatInfo;

            this.removePassengerSeat(passenger);
            // console.log('this.seatmapInfo', this.seatmapInfo);
        } else {
            this.displayMessage('Seat is blocked for this passenger');
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


    changeSeat(passenger) {

        const status = this.getSeatPriceAndStatus(passenger);

        if (status.available) {

            localStorage.setItem('oldSeat', this._cryptoService.encryptData(this.seatmapInfo[passenger.id]));

            // this.communicationService.seatReleased(this.seatmapInfo[passenger.id]);

            if (this.seatmapInfo[passenger.id]) {
                this.seatmapInfo[passenger.id].seatNumber = this.seat.seatNumber;
                this.seatmapInfo[passenger.id].price = status.price;
                this.seatmapInfo[passenger.id].row = this.seat.coordinates.x;
                this.seatmapInfo[passenger.id].column = this.seat.coordinates.y;

                this.removePassengerSeat(passenger);
            }
        } else {
            this.displayMessage('Seat is blocked for this passenger');
        }

        // console.log('this.seatmapInfo', this.seatmapInfo);

    }

    getSeatPriceAndStatus(passenger: any): any {
        let price = 0;
        let available = true;
        // console.log('passenger', passenger);
        this.seat.travelers.forEach(traveler => {
            // console.log('traveler', traveler);
            // console.log(passenger.id === traveler.id);
            // console.log(traveler.seatAvailabilityStatus === 'blocked');

            if (passenger.id === traveler.id && traveler.seatAvailabilityStatus === 'blocked') {
                available = false;
            } else if (passenger.id === traveler.id && traveler.seatAvailabilityStatus === 'available') {
                price = traveler.prices ? traveler.prices[0].total : 0;
            }
        });

        // console.log('available', available);

        return {available, price};
    }


    removePassengerSeat(passenger) {
        for (const passengerId of Object.keys(this.seatmapInfo)) {
            if (this.seatmapInfo[passengerId].seatNumber === this.seat.seatNumber && passengerId !== passenger.id) {
                delete this.seatmapInfo[passengerId];
            }

        }
    }

    cancelSeat(passenger) {

        localStorage.setItem('oldSeat3', this._cryptoService.encryptData(this.seatmapInfo[passenger.id]));
        delete this.seatmapInfo[passenger.id];
    }

    closeDialog(type: string) {
        if (type === 'save') {
            this.dialogRef.close(this.seatmapInfo);
        } else {
            this.dialogRef.close();
        }
    }

    displayMessage(text: string): void {
        this._snackBar.open(text, '', {
            duration: 3000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }

}
