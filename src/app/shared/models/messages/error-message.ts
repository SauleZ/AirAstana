import {IssueSource} from './issue-source';

export class ErrorMessage {

    /**
     * An application-specific error code
     */
    public code: string;

    /**
     * A short summary of the error
     */
    public title: string;

    /**
     * Explanation of the error
     */
    public detail: string;

    /**
     * An object containing references to the source of the error
     */
    public source: IssueSource;

    /**
     * HTTP status code associated
     */
    public status: string;

    constructor() {}

}
