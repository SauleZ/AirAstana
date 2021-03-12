/**
 * Details of stops for direct or change of gauge flights
 */
export class FlightStop {

    /**
     * airportName
     */
    public airportName: string;

    /**
     * Flight will stop at this location
     * pattern: [a-zA-Z]{3}
     */
    public locationCode: string;

    /**
     * City name
     *
     */
    public cityName: string;

    /**
     * Flight will stop at this terminal
     * pattern: [a-zA-Z]{1,25}
     */
    public departureTerminal: string;

    /**
     * Stop duration expressed in seconds
     */
    public duration: number;

    /**
     * Type of stop
     */
    public isChangeOfGauge: boolean;

    /**
     * Arrival at the stop with the following format "yyyy-MM-dd'T'HH:mm:ssZ" (e.g. 2018-02-10T20:40:00+02:00)
     * example: 2018-02-10T20:40:00+02:00
     */
    public arrivalDateTime: string;

    /**
     * Departure from the stop with the following format "yyyy-MM-dd'T'HH:mm:ssZ" (e.g. 2018-02-10T20:40:00+02:00)
     * example: 2018-02-10T20:40:00+02:00
     */
    public departureDateTime: string;

    /**
     * IATA aircraft code (http://www.flugzeuginfo.net/table_accodes_iata_en.php).
     * Specified if a change of gauge (with change of aircraft) occurs
     * pattern: [a-zA-Z0-9]{1,3}
     */
    public aircraftCode: string;

    /**
     * IATA airline code (http://www.iata.org/publications/Pages/code-search.aspx).
     * Defines the aircraft owner airline code for the flight departing from the technical stop's location.
     * pattern: [A-Z0-9]{2,3}
     */
    public aircraftOwnerAirlineCode: string;

    /**
     * Aircraft owner name if the IATA airline code is not available
     * pattern: [A-Z0-9]{1,60}
     */
    public aircraftOwnerAirlineName: string;

    constructor() {}

}
