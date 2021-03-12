import {Passenger} from '../passenger/passenger';

/**
 * CartRequest can be used to create a Cart with sub-resources such as Passengers, Contacts, Frequent flyer cards
 * Contacts and Frequent flyer cards can be associated to Passengers using temporary ids, when those sub-resources
 * are manipulated in the same transaction
 */
export class CartRequest {

    /**
     * Identifier of an offer
     *
     * pattern: [a-zA-Z0-9-]{1,120}
     */
    public offerId: string;

    /**
     * List of passengers (individual taking part in the journey)
     */
    public passengers: Passenger[];


    constructor() {}

}
