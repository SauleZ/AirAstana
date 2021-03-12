/**
 * Calendar day information - lowest price for current date
 */
export class CalendarCell {

    /**
     * Base price. It includes some surcharges, but no taxes nor fees
     * minimum: 0
     */
    public base: number;

    /**
     * Total price, including base fare, taxes, surcharges and fees (excluding credit or debit card fees)
     * minimum: 0
     */
    public total: number;

    /**
     * ISO currency code. It allows accessing the currency dictionary, containing any information
     * related to the currency: in particular decimalPlaces can be used to determine the amount
     * actual value and display. Example: the numerical amount 1955 associated to the EUR
     * currency code (decimalPlaces: 2) corresponds to: 19,55 Euro.
     * For points (or miles) the code associated is MIL, for compensation/upgrade credits ECR.
     *
     * pattern: [A-Z]{3}
     */
    public currencyCode: string;

    /**
     * Sum of all taxes (including surcharges)
     * minimum: 0
     */
    public totalTaxes: number;

    /**
     * Sum of all surcharges
     * minimum: 0
     */
    public totalSurcharges: number;

    /**
     * Sum of all fees
     * minimum: 0
     */
    public totalFees: number;

    /**
     * Departure date
     */
    public departureDate: string;

    /**
     * Return date
     */
    public returnDate: string;

    constructor() {}

}
