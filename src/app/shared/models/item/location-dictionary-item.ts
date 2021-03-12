/**
 * Location dictionary
 */
export class LocationDictionaryItem {

    /**
     * Location type: airport, city or state
     *
     * Enum: [airport, city, state]
     */
    public type: string;

    /**
     * Localized name of the airport (not returned if the location is a city or a state)
     */
    public airportName: string;

    /**
     * IATA city code. City code associated to airport (not returned if the location is a city or a state)
     * pattern: [a-zA-Z]{3}
     */
    public cityCode: string;

    /**
     * Localized name of the city (not returned if the location is a state)
     * pattern: [a-zA-Z -]{1,35}
     */
    public cityName: string;

    /**
     * State code (two character standard IATA state code)
     * pattern: [a-zA-Z0-9]{1,2}
     */
    public stateCode: string;

    /**
     * ISO 3166-1 country code
     * pattern: [a-zA-Z0-9]{2}
     */
    public countryCode: string;

    /**
     * Timezone of the city in UTC. This information is available only in Order Dictionary.
     * pattern: UTC(\+|\-)[0-9]{4}
     * example: UTC+0530
     */
    public timeZone: string;

    constructor() {}

}
