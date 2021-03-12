/**
 * Object containing token parameters
 */
export class TokenInformation {

    /**
     * Type of the token
     */
    public tokenType: string;

    /**
     * Access token
     */
    public accessToken: string;

    /**
     * Expire time in seconds (minimum: 1790)
     */
    public expiresIn: number;

    constructor() {}

}
