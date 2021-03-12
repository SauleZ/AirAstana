import {LocationDictionaryItem} from '../item/location-dictionary-item';
import {FareFamilyContainer} from '../fare-family/fare-family-container';
import {FlightContainer} from '../flight/flight-container';
import {Price} from '../cost/price';
import {Rates} from './rate';
import {CostBase} from '../cost/costBase';

/**
 * Each bound corresponds to a group of flights. A one way trip contains one single bound.
 * A round trip or open jaw trip contains two bounds (outbound and inbound).
 */
export class Bound {

    /**
     * Unique identificator of bound
     */
    public id: string;

    /**
     * List of offer ids which references to current bound. This identificator needs to create Cart.
     * If departure and return flight selected, you should find offer id which exists in both bounds.
     *
     * Identifier of an offer
     *
     * name: offerId
     * required: true
     * in: path
     * pattern: [a-zA-Z0-9-]{1,120}
     */
    public offerIds: string[];

    /**
     * Location dictionary
     */
    public originLocation: LocationDictionaryItem;

    /**
     * Location dictionary
     */
    public destinationLocation: LocationDictionaryItem;

    /**
     * Duration of the flight expressed in seconds.
     */
    public duration: number;

    /**
     * Flight information corresponding to a flight id. This object includes flight information.
     * A flight element may be composed of several legs (FlightEndPoint).
     */
    public flights: FlightContainer[];

    /**
     * Price breakdowns expressed as exhaustive amounts
     */
    public cost: Price;

    /**
     * Rate with fare family code and price for current flight
     */
    public rates: Rates[];

    public minimumCost: CostBase;

}
