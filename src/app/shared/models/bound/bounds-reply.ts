import {Bound} from './bound';

/**
 * List of bounds splitted by outbound and inbound. If it one way trip, there is only outbound.
 */
export class BoundsReply {

    public outbounds: Bound[];
    public inbounds: Bound[];

    constructor() {}

}
