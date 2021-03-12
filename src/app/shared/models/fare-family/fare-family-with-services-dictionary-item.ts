import {FareFamilyService} from './fare-family-service';

/**
 * Fare Family dictionary with services
 */
export class FareFamilyWithServicesDictionaryItem {

    /**
     * Hierarchy of the fare family as defined on the GDS.
     */
    public hierarchy: number;

    /**
     * Commercial Fare Family associated
     */
    public commercialFareFamily: string;

    /**
     * Cabin used for Fare Family
     */
    public cabin: string;

    /**
     * A list of ancillary services linked to this Fare family
     */
    public services: FareFamilyService[];


    constructor() {}

}
