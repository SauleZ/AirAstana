/**
 * Any contact information. There are three types of contacts: email, phone number or address.
 * Contact is a polymorphic object, meaning that it contains only the basic structure from
 * which derive the three types of contacts.
 */
export abstract class Contact {

    /**
     * Identifier of the resource. not read / taken into account when creating a resource
     */
    public id: string;

    /**
     * Temporary id that can be used to associate requested and returned contacts. Valid only for the time of the transaction
     *
     * pattern: [a-zA-Z0-9_]{1,20}
     */
    public tid: string;

    /**
     * List of travelers associated to the contacts stored in the cart. If not specified, the contact applies to all
     * travelers. Traveler association is required when the contactType has a 'notification' purpose.
     *
     * pattern: [a-zA-Z0-9-]{1,20}]
     */
    public travelerIds: string[];

    /**
     * List of travelers temporary ids associated to stored in the cart. It can be used when both the contact and its
     * associated traveler(s) are added simultaneously. Traveler association is required when the contactType has a
     * 'notification' purpose.
     *
     * pattern: [a-zA-Z0-9_]{1,20}]
     */
    public travelerTIds: string[];

    /**
     * Category of contact usage
     * Enum: [personal, business, agency, other]
     * default: personal
     */
    public category: string;

    /**
     * Recipient name to be used if different from the traveler name (e.g. in case of emergency phone
     * it corresponds to name of the person to be contacted)
     *
     * pattern: [a-zA-Z -]{1,70}
     */
    public addresseeName: string;

    /**
     * if set, this flag indicates that the contact belongs to an other person than
     * the passenger (e.g. friend or family member not part of the trip).
     * This option is only available for mobile phone and email and for a notification purpose.
     */
    public isThirdParty: boolean;

    /**
     * Enum: [Email, Address, Phone]
     */
    public contactType: string;


    constructor() {}

}
