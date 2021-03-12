/**
 * The request for a authentication.
 */
export class AuthenticationRequest {

    /**
     * Unique identifier
     */
    public clientId: string;

    /**
     * Client specific password
     */
    public clientPassword: string;

    constructor() {}
}
