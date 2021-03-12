/**
 * Special Service Request (SSR) for an order
 */
export class AddSpecialServiceRequest {

    /**
     * Code of the Special Service Request (short text)
     */
    public code: string;

    /**
     * A list of travelers associated to this generic service. If not specified, the generic service applies to all travelers
     */
    public travelerIds: string[];

    /**
     * A list of flights associated to this generic service. If not specified, the generic service applies to all flights
     */
    public flightIds: string[];
}
