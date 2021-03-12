/**
 * Passenger Personal Info
 */
export class Personality {

    /**
     * Passengers identifier
     */
    public id: string;

    /**
     * Passengers type codes. ADT, CHD, INF
     * 'INF' corresponds to an infant without seat automatically associated to the first eligible traveler provided in the list
     *
     * pattern: [a-zA-Z0-9]{2,3}
     * example: ADT
     */
    public passengerTypeCode: string;

    /**
     * When flying, if an infant is traveling without a seat, it must be associated to an adult traveler.
     * Id of the adult must be specified in that case
     *
     * pattern: [a-zA-Z0-9-]{1,20}
     */
    public accompanyingTravelerId: string;

    /**
     * Individual first name. If the person has middle names, both first and middle name should be added here (e.g. Arthur Ignatius)
     *
     * example: Arthur Ignatius
     * pattern: ^[A-Za-z\u0080-\u04FF][A-Za-z\u0080-\u04FF\u2019 -.]{0,69}$
     */
    public firstName: string;

    /**
     * example: Holmes
     * pattern: ^[A-Za-z\u0080-\u04FF][A-Za-z\u0080-\u04FF\u2019 -.]{1,69}$
     */
    public lastName: string;

    /**
     * Individual title (MR Mister ...)
     *
     * example: Dr
     * pattern: [a-zA-Z -]{1,20}
     */
    public title: string;

    /**
     * Date of birth (date in ISO 8601: http://www.w3.org/TR/NOTE-datetime)
     *
     * example: 2002-07-25
     */
    public dateOfBirth: string;

    /**
     * Gender of the traveler (value 'unknown' to be used for undisclosed gender).
     * This attribute is available for the Cart resource.
     * In the context of an Order, the information could be retrieved as well from regulatory documents (when specified).
     *
     * Enum: [male, female, unspecified, unknown]
     */
    public gender: string;

    constructor(passengerTypeCode: string) {
        this.passengerTypeCode = passengerTypeCode;
    }

}
