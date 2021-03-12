import {CalendarCell} from './calendar-cell';

/**
 * Calendar data with departure and return flight dates
 */
export class CalendarReply {

    /**
     * Calendar day information - lowest price for current date
     */
    public returnDates: CalendarCell;

    constructor() {}

}
