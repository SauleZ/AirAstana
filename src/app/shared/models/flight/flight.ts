import {FlightEndPoint} from './flight-endpoint';
import {FlightPerformanceIndicator} from './flight-performance-indicator';
import {FlightStop} from './flight-stop';
import {Meal} from '../meal/meal';

/**
 * Flight information corresponding to a flight id. This object is included in the FlightDictionary.
 * A flight element may be composed of several legs (FlightEndPoint).
 */
export class Flight {

    /**
     * Airline name
     */
    public airline: string;

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

    /**
     * Departure or arrival information (if case of multiple legs, departure for the first leg)
     */
    public departure: FlightEndPoint;

    /**
     * Departure or arrival information (if case of multiple legs, departure for the first leg)
     */
    public arrival: FlightEndPoint;

    /**
     * Aircraft name
     */
    public aircraft: string;

    /**
     * IATA aircraft code (http://www.flugzeuginfo.net/table_accodes_iata_en.php)
     * pattern: [a-zA-Z0-9]{1,3}
     */
    public aircraftCode: string;

    /**
     * Duration time expressed in seconds
     */
    public duration: number;

    /**
     * Open segment
     * default: false
     */
    public isOpenSegment: boolean;

    /**
     * Flag indicating if some travel documents are needed for this flight
     * default: false
     */
    public secureFlightIndicator: boolean;

    /**
     * Details of the flight on-time performance indicator
     */
    public performanceIndicator: FlightPerformanceIndicator;

    /**
     * Details of stops for direct or change of gauge flights
     */
    public stop: FlightStop;

    /**
     * Meals information
     */
    public meals: Meal;

    /**
     * Status of the flight
     *
     * Enum: [scheduled, departed, cancelled, delayed, arrived, landingCancelled, diverted]
     */
    public flightStatus: string;

    constructor() {}

}
