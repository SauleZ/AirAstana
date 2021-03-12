import {Contact} from './contact';

/**
 * Address information. Derived from Contact object by polymorphism
 */
export class Address extends Contact {

    /**
     * Contact purpose
     * Enum: [billing, mailing]
     * default: standard
     */
    public purpose: string;

    /**
     * Line 1 = Street address, Line 2 = Apartment, suite, unit, building, floor, etc
     * maxItems: 2, minItems: 1
     */
    public lines: string[];

    /**
     * Name of the company
     *
     * pattern: [a-zA-Z -]{1,30}
     */
    public companyName: string;

    /**
     * Post office code number
     *
     * pattern: [a-zA-Z0-9]{1,20}
     */
    public zipCode: string;

    /**
     * ISO 3166-1 country code
     *
     * pattern: [a-zA-Z0-9]{2}
     */
    public countryCode: string;

    /**
     * Localized name of the city
     *
     * pattern: [a-zA-Z -]{1,35}
     */
    public cityName: string;

    /**
     * State code (two character standard IATA state code)
     *
     * pattern: [a-zA-Z0-9]{1,2}
     */
    public stateCode: string;

    /**
     * Postal Office Box
     *
     * pattern: [a-zA-Z0-9]{1,10}
     */
    public postalBox: string;


    constructor() {
        super();
    }

}
