/**
 * Fare Family associated Service
 */
export class FareFamilyService {

    /**
     * Service item identifier as defined in the services dictionary
     */
    public serviceCode: string;

    /**
     * Applicability of this service for the given fare family:
     * included - service included at no charge
     * chargeable - service available at a charge
     * notOffered - service not offered
     *
     * Enum: [included, chargeable, notOffered]
     */
    public applicability: string;


    constructor() {}

}
