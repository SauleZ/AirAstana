/**
 * Fare Family dictionary
 */
export class FareFamilyDictionaryItem {

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


    constructor() {}
}
