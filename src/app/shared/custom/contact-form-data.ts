export class ContactFormData {

    public address: string;
    public phoneForm: any;

    constructor() {
        this.address = '';
        this.phoneForm = {};
        this.phoneForm.code = '';
        this.phoneForm.phone = '';
    }

}
