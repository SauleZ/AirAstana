import {Contact} from './contact';

/**
 * Email information. Derived from Contact object by polymorphism
 */
export class Email extends Contact{

    /**
     * Contact purpose
     * Enum: [standard, notification, information]
     * default: standard
     */
    public purpose: string;

    /**
     * Email address, e.g. test@airastana.com
     */
    public address: string;

    /**
     * Code of the preferred language to be used, e.g. en-GB for English-United Kingdom. For more details
     *
     * pattern: [a-zA-Z0-9-]{2,5}
     */
    public lang: string;


    constructor() {
        super();
    }

}
