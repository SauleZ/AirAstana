/**
 * Simple price object
 */
export class CostBase {

    /**
     * Total price, including base fare, taxes, surcharges and fees (excluding credit or debit card fees)
     */
    public total: number;

    /**
     * Selling currency ISO currency code. It allows accessing the currency dictionary, containing any information related to the currency:
     * in particular decimalPlaces can be used to determine the amount actual value and display.
     * Example: the numerical amount 1955 associated to the EUR currency code (decimalPlaces: 2) corresponds to: 19,55 Euro.
     * For points (or miles) the code associated is MIL, for compensation/upgrade credits ECR.
     */
    public currencyCode: string;
}
