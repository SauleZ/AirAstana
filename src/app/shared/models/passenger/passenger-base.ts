/**
 * Passenger Base
 */
export class PassengerBase {

    /**
     * Passengers identifier
     */
    public id: string;

    /**
     * Passengers type codes. ADT, CHD, INF
     * 'INF' corresponds to an infant without seat automatically
     * associated to the first eligible traveler provided in the list
     *
     *  pattern: [a-zA-Z0-9]{2,3}
     *  example: ADT
     */
    public passengerTypeCode: string;

    /**
     * When flying, if an infant is traveling without a seat, it must be associated to an adult traveler.
     * Id of the adult must be specified in that case
     *
     * pattern: [a-zA-Z0-9-]{1,20}
     */
    public accompanyingTravelerId: string;


    constructor() {}

}
