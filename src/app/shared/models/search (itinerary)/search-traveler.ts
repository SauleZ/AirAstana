/**
 * Object used to define common traveler input for a search
 */
export class SearchTraveler {

    /**
     * Passengers type codes. ADT, CHD, INF
     * 'INF' corresponds to an infant without seat automatically associated to the first eligible
     * traveler provided in the list
     *
     * pattern: [a-zA-Z0-9]{2,3}
     * example: ADT
     */
    public passengerTypeCode: string;

    constructor() {}

}
