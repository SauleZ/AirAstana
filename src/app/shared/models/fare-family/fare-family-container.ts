import {FareFamilyDictionaryItem} from './fare-family-dictionary-item';
import {FareFamilyWithServicesDictionaryItem} from './fare-family-with-services-dictionary-item';

/**
 * Container of fare family information
 */
export class FareFamilyContainer {

    /**
     * Identifier of fare family
     */
    public id: string;

    /**
     * Fare Family dictionary
     */
    public fareFamily: FareFamilyDictionaryItem;

    /**
     * Fare Family With Services Dictionary Item
     */
    public fareFamilyWithServices: FareFamilyWithServicesDictionaryItem;

    constructor() {}

}
