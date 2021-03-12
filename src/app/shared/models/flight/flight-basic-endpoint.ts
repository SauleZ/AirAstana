/**
 * Departure or arrival information (if case of multiple legs, departure for the first leg)
 */
export class FlightBasicEndPoint {

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

    constructor() {}

}
