/**
 * Description of an common itinerary subject of the search
 */
export class CommonItinerary {

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

    /**
     * Departure date and time of the outbound (first departure flight)
     * in ISO 8601 [http://www.w3.org/TR/NOTE-datetime].
     * It specifies date and hours of the search (eg. 2017-11-10T10:21:00)
     */
    public departureDateTime: string;

    constructor() {}

}
