export class RestResponse {

    constructor(
        public data?: any,
        public warnings?: any[],
        public errors?: any[]
    ) {
    }

}
