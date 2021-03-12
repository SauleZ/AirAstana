import {Personality} from '../personal-info/personality';
import {Contact} from '../personal-info/contact';
import {FrequentFlyerCard} from '../card/frequent-flyer-card';

/**
 * Individual taking part in a journey
 */
export class Passenger {

    /**
     * Personal Info
     */
    public personality: Personality;

    /**
     * Contacts
     */
    public contacts: Contact[];

    /**
     * Frequent flyer card that can be used to accrue or redeem miles (only mileage accrual supported so far).
     * The Frequent Flyer Card can be associated to a Shopping cart as well as a Journey.
     */
    public frequentFlyerCard: FrequentFlyerCard;


    constructor() {}

}
