export class FlightCommon {

    /**
     * IATA airline code (http://www.iata.org/publications/Pages/code-search.aspx)
     * pattern: [A-Z0-9]{2,3}
     */
    public marketingAirlineCode: string;

    /**
     * IATA airline code (http://www.iata.org/publications/Pages/code-search.aspx)
     * pattern: [A-Z0-9]{2,3}
     */
    public operatingAirlineCode: string;

    /**
     * Airline name if there is no airline code for the operating carrier
     * pattern: [A-Z0-9]{1,60}
     */
    public operatingAirlineName: string;

    /**
     * Marketing flight number
     * pattern: [A-Z0-9]*
     * example: 123
     */
    public marketingFlightNumber: string;

    /**
     * Operating airline flight number
     * pattern: [A-Z0-9]*
     * example: 123
     */
    public operatingAirlineFlightNumber: string;

    /**
     * IATA airline code (http://www.iata.org/publications/Pages/code-search.aspx).
     * Defines the actual aircraft owner airline operating the flight
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
