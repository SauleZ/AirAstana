import {Price} from './price';
import {UnitCost} from './unit-cost';

/**
 * Container object
 */
export class CostContainer {

    /**
     * Price breakdowns expressed as exhaustive amounts
     */
    public cost: Price;

    /**
     * List of unitCosts
     */
    public unitCosts: UnitCost[];


    constructor() {}

}
