import {ErrorMessage} from '../messages/error-message';
import {WarningMessage} from '../messages/warning-message';
import {TokenInformation} from './token-information';

/**
 * Authentication response with access token and token type. Token will expire in 'expiresIn' seconds
 */
export class AuthenticationResponse {

    /**
     * Array of error messages
     */
    public errors: ErrorMessage[];

    /**
     * Array of warning messages
     */
    public warnings: WarningMessage[];

    /**
     * Token parameters
     */
    public data: TokenInformation;

    constructor() {}

}
