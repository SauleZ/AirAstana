import {Price} from '../cost/price';
import {FareFamilyContainer} from '../fare-family/fare-family-container';

/**
 * Rate with fare family code and price for current flight
 */
export class Rates {

    public offerIds: string[];
    public cost: Price;
    public fareFamilyContainer: FareFamilyContainer;

    constructor() {}

}
