import {AuthenticationRequest} from '../models/authentication/authentication-request';

export class ClientData {

    private static readonly CLIENT_ID = 'cca17274-cbf2-11ea-87d0-0242ac130003';
    private static readonly CLIENT_PASSWORD = 'dRwhxx9dv9SaHZZ5GKXMHChUmubZ4wKn';

    public static getAuthenticationRequest(): AuthenticationRequest {
        const authenticationRequest = new AuthenticationRequest();
        authenticationRequest.clientId = this.CLIENT_ID;
        authenticationRequest.clientPassword = this.CLIENT_PASSWORD;
        return authenticationRequest;
    }


}
