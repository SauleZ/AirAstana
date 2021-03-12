/**
 * Block information
 */
export class SeatmapBlock {

    /**
     * Identifier
     */
    public id: string;

    /**
     * Number of extra oxygen masks remaining for this block on this flight at this date in Inventory.
     * This number must be revised with current PNR or trip to get final number of extra oxygen masks
     */
    public nbrRemainingExtraOxygenMasks: number;


    constructor() {}

}
