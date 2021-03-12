import {Offer} from '../offer/offer';
import {Passenger} from '../passenger/passenger';

/**
 * Cart content
 */
export class Cart {

    /**
     * Cart id
     */
    public id: string;

    /**
     * List of offers
     */
    public offers: Offer[];

    /**
     * List of passengers (individual taking part in the journey)
     */
    public passengers: Passenger[];


    constructor() {}

}
