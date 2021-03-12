/**
 *  An object containing references to the source of the error
 */
export class IssueSource {

    /**
     *  A JSON Pointer [RFC6901] to the associated entity in the request document
     */
    public pointer: string;

    /**
     * A string indicating which URI query parameter caused the issue
     */
    public parameter: string;

    constructor() {}

}
