import {Contact} from './contact';

/**
 * Phone information. Derived from Contact object by polymorphism
 */
export class Phone extends Contact {

    /**
     * Phone device type
     * Enum: [mobile, landline, fax]
     * default: landline
     */
    public deviceType: string;

    /**
     * Contact purpose
     * Enum: [standard, notification, emergency, information]
     * default: standard
     */
    public purpose: string;

    /**
     * Country code phone extension (e.g. +49 for Germany)
     *
     * pattern: ([+]?)([0-9]{1,5})
     */
    public countryPhoneExtension: string;

    /**
     * Phone area code.
     *
     * pattern: [0-9]{1,4}
     */
    public areaCode: string;

    /**
     * Phone number including Work extension (when applicable)
     *
     * pattern: [0-9]{1,15}(x[0-9]{1,8})?
     */
    public number: string;

    /**
     * ISO 3166-1 country code. Used to specify the country of the person to be called in case of emergency
     *
     * pattern: [a-zA-Z0-9]{2}
     */
    public countryCode: string;

    /**
     * Code of the preferred language to be used, e.g. en-GB for English-United Kingdom. For more details
     *
     * pattern: [a-zA-Z0-9-]{2,5}
     */
    public lang: string;

    /**
     * Code of the city (e.g. LON for London) associated to the Phone contact. Information available only at Order management time.
     *
     * pattern: [a-zA-Z]{2,3}
     */
    public cityCode: string;


    constructor() {
        super();
    }

}
