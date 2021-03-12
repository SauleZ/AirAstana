import {FlightItem} from './flight-item';
import {Flight} from './flight';

/**
 * Flight information corresponding to a flight id. This object includes flight information.
 * A flight element may be composed of several legs (FlightEndPoint).
 */
export class FlightContainer {

    public item: FlightItem;
    public details: Flight;

    constructor() {}

}
