export class FlightItem {

    /**
     * Flight id, as defined in flights dictionary
     */
    public id: string;

    /**
     * Enum: [eco, ecoPremium, business, first]
     */
    public cabin: string;

    /**
     * Booking class associated to the cabin
     */
    public bookingClass: string;

    /**
     * Operational status. HK = confirmed, HL = waitlist, TK = schedule change confirmed, schedule change waitlist,
     * UN = unable to confirm not operating, UC = unable to confirm, HX = have cancelled, NO = no action taken.
     * At shopping time, the only status that can be returned is HL=Wailist
     */
    public statusCode: string;

    /**
     * In case of flight connection, it expresses the waiting time until the next flight. Duration expressed in seconds
     */
    public connectionTime: number;

    /**
     * Order id created on the airline reservation system for the airline of that flight.
     * It could be for example the reservation number created on the PSS of the airline when the airline is not on Altea.
     */
    public airlineOrderId: string;

    /**
     * Number of remaining seats for this flight. Quota is only returned in case of low availability
     * at shopping time or when performing a Cart refresh.
     * minimum: 0, maximum: 9
     */
    public quota: number;

    /**
     * Number of days difference compared to the departure time of the first flight of the bound.
     * Information computed considering the local date and returned only if dates not referring to the same day.
     * 'Example: +2' as departure days difference means the flight will take off '2' days later than first flight took off.
     */
    public departureDaysDifference: number;

    /**
     * Number of days difference compared to the departure time of the first flight of the bound.
     * Information computed considering the local date and returned only if dates not referring to the same day.
     * 'Example: +2' as arrival days difference means the flight will take off '2' days later than first flight took off.
     */
    public arrivalDaysDifference: number;

    /**
     * Fare family of the flight.
     */
    public fareFamilyCode: string;

    constructor() {}

}
