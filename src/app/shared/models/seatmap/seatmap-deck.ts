import {SeatmapDeckDimensions} from './seatmap-deck-dimensions';
import {SeatmapBlock} from './seatmap-block';
import {SeatmapFirstAvailableSeat} from './seatmap-first-available-seat';
import {SeatmapSeatProperties} from './seatmap-seat-properties';
import {SeatmapFacility} from './seatmap-facility';

export class SeatmapDeck {

    /**
     * A deck is a level on an aircraft. The deck location of the cabin (current possible values are upper or main)
     * The main deck, where passengers are seated on a passenger flight.
     * Upper deck is above the main deck where more passengers are seated.
     *
     * Enum: [upper, main]
     */
    public deckType: string;

    /**
     * Deck dimensions are used as a reference to display the entire aircraft or to the section associated
     * to the requested cabin (or set of cabins)
     */
    public deckDimensions: SeatmapDeckDimensions;

    /**
     * Seatmap blocks list
     */
    public blocks: SeatmapBlock[];

    /**
     * Information regarding the first available seat on a given deck (cabin dependent)
     */
    public firstAvailableSeat: SeatmapFirstAvailableSeat;

    /**
     * Seat
     */
    public cheapestSeat: SeatmapSeatProperties;

    /**
     * Facilities list
     */
    public facilities: SeatmapFacility[];

    /**
     * Seat
     */
    public seats: SeatmapSeatProperties[];


    constructor() {}

}
