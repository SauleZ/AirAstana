/**
 * Common search request
 */
export class SearchRequest {

    /**
     * Is client resident of Republic of Kazakhstan
     */
    public isResident: boolean;

    /**
     * Region code of official website. Pattern '^([A-Z]{2,3}|GLOBAL)$'
     */
    public regionCode: string;

    /**
     * ISO standard 2 character language code. Pattern '^[A-Z]{2}$'
     */
    public languageCode: string;

    /**
     * Preferred cabin type - Economy or Business
     */
    public cabinType: string;

    constructor() {}
}
