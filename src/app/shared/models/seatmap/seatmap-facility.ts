import {SeatmapCoordinates} from './seatmap-coordinates';

export class SeatmapFacility {

    /**
     * Facility code, as described in the facility dictionary
     */
    public code: string;

    /**
     * Facility type, as described in the facility dictionary
     */
    public facilityType: string;

    /**
     * Column
     */
    public column: string;

    /**
     * Row
     */
    public row: string;

    /**
     * Position is either front, rear or seat (in case the facility takes the place of a seat)
     *
     * Enum: [front, rear, seat]
     */
    public position: string;

    /**
     * Coordinates
     */
    public coordinates: SeatmapCoordinates;


    constructor() {}

}
