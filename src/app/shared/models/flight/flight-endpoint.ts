/**
 * Departure or arrival information (if case of multiple legs, departure for the first leg)
 */
export class FlightEndPoint {

    /**
     * Localized name of the airport (not returned if the location is a city or a state)
     */
    public airportName: string;

    /**
     * IATA city code. City code associated to airport (not returned if the location is a city or a state)
     */
    public cityCode: string;

    /**
     * Localized name of the city (not returned if the location is a state)
     */
    public cityName: string;

    /**
     * ISO 3166-1 country code
     */
    public countryCode: string;

    /**
     * IATA airport code
     * pattern: [a-zA-Z]{3}
     */
    public locationCode: string;

    /**
     * Local date and time with the following format "yyyy-MM-dd'T'HH:mm:ssZ" (e.g. 2018-02-10T20:40:00+02:00)
     * example: 2018-02-10T20:40:00+02:00
     */
    public dateTime: string;

    /**
     * Estimated time, in case of delay or other modification.
     * Local date and time with the following format "yyyy-MM-dd'T'HH:mm:ssZ" (e.g. 2018-02-10T20:40:00+02:00)
     * example: 2018-02-10T21:40:00+02:00
     */
    public estimatedDateTime: string;

    /**
     * Terminal number
     * pattern: [a-zA-Z0-9]{1,25}
     */
    public terminal: string;

    constructor() {}

}
