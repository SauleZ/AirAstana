import {Price} from '../cost/price';

export class SeatmapTravelerSeatInfo {

    /**
     * Traveler id (anonymous or known). In case of a stand-alone seatmap transaction or a seatmap transaction based
     * on a cart that does not contain travelers, travelers id is defined in anonymousTraveler dictionary.
     * Otherwise traveler id is defined in Cart or Order
     *
     * pattern: [a-zA-Z0-9-]{1,20}
     */
    public id: string;

    /**
     * Temporary id used to map travelers in the response with the travelers in the request. Only valid the time of the transaction
     *
     * example: PAX1
     * pattern: [a-zA-Z0-9_]{1,20}
     */
    public tid: string;

    /**
     * List of seat characteristics for the current traveler (the characteristic's descriptions
     * can be retrieved in the seat characteristic dictionary)
     */
    public seatCharacteristicsCodes: string[];

    /**
     * Seat availability for this specific traveler. Allows better seat choice per traveler
     *
     * Enum: [available, blocked, occupied]
     */
    public seatAvailabilityStatus: string;

    /**
     * List of reason for restrictions of seat
     */
    public reasonForRestrictionCodes: string[];

    /**
     * Price for a given seat
     */
    public prices: Price[];

    /**
     * If true, the seat is exempted
     */
    public isExempted: boolean;

    /**
     * List of service IDs of the master pack services
     */
    public packServiceIds: string[];

    /**
     * Id of the cart/Order selected master service pack
     */
    public selectedPackServiceId: string;


    constructor() {}

}
