/**
 * Frequent flyer card that can be used to accrue or redeem miles (only mileage accrual supported so far). T
 * he Frequent Flyer Card can be associated to a Shopping cart as well as a Journey.
 */
export class FrequentFlyerCard {

    /**
     * Card number
     *
     * pattern: [a-zA-Z0-9]{1,25}
     * example: 992003172079000
     */
    public cardNumber: string;

    /**
     * Company code of FF
     *
     * pattern: [A-Z]{1,2} example: KC
     */
    public companyCode: string;

    /**
     * Corporate card number
     *
     * pattern: [0-9]{9}
     * example: 999888777
     */
    public corporateCardNumber: string;

    constructor() {}

}
