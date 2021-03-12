/**
 * Description of an common itinerary subject of the search
 */
export class CityPair {

    /**
     * Departure location code of outbound (city or airport code)
     * pattern: [a-zA-Z]{3}
     */
    public originLocationCode: string;

    /**
     * Destination location code (city or airport code) for the outbound,
     * in case of a round trip this is also the departure location code of second bound
     * pattern: [a-zA-Z]{3}
     */
    public destinationLocationCode: string;

    constructor() {}

}
