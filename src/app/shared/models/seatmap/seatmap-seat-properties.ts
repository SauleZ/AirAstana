import {SeatmapTravelerSeatInfo} from './seatmap-traveler-seat-info';
import {SeatmapCoordinates} from './seatmap-coordinates';

/**
 * Seat properties
 */
export class SeatmapSeatProperties {

    /**
     * Cabin of the seat, in single letter format e.g. "Y"
     */
    public cabin: string;

    /**
     * Concatenation of the row id and the column id, for example 12B
     */
    public seatNumber: string;

    /**
     * List of seat characteristics (the value is a value that can be retrieved in the seat characteristic dictionary).
     * List of seat characteristics at seat level will be returned when no specific travelers are specified for
     * the seatmap computation, otherwise the characteristics will be specified for each traveler.
     */
    public seatCharacteristicsCodes: string[];

    /**
     * Check if an infant is seating on this seat. If the system detects there is no infant, value is false.
     * If information is unknown, the node is not present (isInfantOnSeat not returned or null)
     */
    public isInfantOnSeat: boolean;

    /**
     * Availability status based on seat occupation and traveler information. Most permissive availability is computed for multiple
     * travelers Availability status at seat level will be returned when no specific travelers are specified for the seatmap computation,
     * otherwise the availability will be specified for each traveler.
     *
     * Enum: [available, blocked, occupied]
     */
    public seatAvailabilityStatus: string;

    /**
     * List of reason for restriction of seat. When calling the seatmap some seats can be unavailable for the user to be selected.
     * Most of the time a seat is already taken, but some other time the seat selection is restricted by the airline.
     * For example, a seat can be available to be selected only if the user is a frequent flyer.
     *
     * Example on possible values:
     * TARG: Target zone
     * MASK: Unavailable seat
     * CHSP: Chargeable seat
     * ASRE: Chargeable seat
     * SPTR: Chargeable seat
     * PROT: Protected seat
     * BLCS: Promotes seats reserved for the passenger's airline
     * GRRS: Group
     * ZONL: Legal suitability rule
     * ZONM: Mandatory suitabulity rule
     * THEO: Theoretical
     * RSTG: Reseating
     * EXST: Extra seat
     * CBBG: Cabin beggage
     * INFA: Infant seat
     * BLCS: Codeshare seat
     * ACCR: Quota Chargeable
     * RDEL: Delivered
     * SMCU: Booking Class
     * SFRC: Reaccomodation
     * ASE1: Adjacency
     * AFA1: Adjacency
     * ASP1: Adjacency
     * THR1: Through seat
     * ZONR: Releasable suitability rule
     * COUR: Courtesy
     * SPRQ: Request seat
     */
    public reasonForRestrictionCodes: string[];

    /**
     * Traveler's seat information and price
     */
    public travelers: SeatmapTravelerSeatInfo[];

    /**
     * Please refer to block section, with number of oxygen seats
     */
    public blockId: string;

    /**
     * Tells whether seat can be exchangeable, refundable or commissionable
     */
    public seatType: string;

    /**
     * x, y, z coordinates
     */
    public coordinates: SeatmapCoordinates;


    constructor() {}

}
