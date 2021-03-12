import {CommonItinerary} from './common-itinerary';
import {SearchTraveler} from './search-traveler';

/**
 * Inputs needed to perform an calendar search
 */
export class MainSearchRequest {

    /**
     * Is client resident of Republic of Kazakhstan
     */
    public isResident: boolean;

    /**
     * Region code of official website. Pattern '^([A-Z]{2,3}|GLOBAL)$'
     */
    public regionCode: string;

    /**
     * ISO standard 2 character language code. Pattern '^[A-Z]{2}$'
     */
    public languageCode: string;

    /**
     * Preferred cabin type - Economy or Business
     */
    public cabinType: string;

    /**
     * List of itineraries. One for one-way and two for round-trip.
     */
    public itineraries: CommonItinerary[];

    /**
     * List of passengers, only passengers type codes.
     */
    public passengers: SearchTraveler[];

    constructor() {}
}
