import {SeatmapDeck} from './seatmap-deck';
import {SeatmapCoordinatesUnit} from './seatmap-coordinates-unit';

export class SeatmapDescription {

    /**
     * Specify if information was provided by the airline (false), or if generic data are used based on the equipement (true)
     */
    public computedCoordinates: boolean;

    /**
     * Decks
     */
    public decks: SeatmapDeck[];

    /**
     * Seatmap coordinates unit
     */
    public coordinates: SeatmapCoordinatesUnit;


    constructor() {}

}
