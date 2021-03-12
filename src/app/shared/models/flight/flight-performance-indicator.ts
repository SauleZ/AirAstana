/**
 * Details of the flight on-time performance indicator
 */
export class FlightPerformanceIndicator {

    /**
     * Percentage of on-time arrival (from 0 to 100)
     */
    public onTimeArrival: number;

    /**
     * Period from which the data are calculated
     * example: 2018-02-10T20:40:00+02:00
     */
    public calculationPeriod: string;

    /**
     * Accuracy of the percentage data
     */
    public dataAccuracy: string;

    constructor() {}

}
