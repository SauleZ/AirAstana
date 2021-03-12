export class PassengerFormData {

    public firstName: string;
    public lastName: string;
    public gender: string;
    public documentType: string;
    public documentNumber: string;
    public dateOfBirth: string;
    public membershipCheck: boolean;
    public membershipNumber: string;
    public program: string;
    public passengerTypeCode: string;

    constructor(type: string) {
        this.firstName = '';
        this.lastName = '';
        this.gender = '';
        this.documentType = '';
        this.documentNumber = '';
        this.dateOfBirth = '';
        this.membershipCheck = false;
        this.membershipNumber = '';
        this.program = '';
        this.passengerTypeCode = type;
        // if (type === 'adult') {
        //     this.passengerTypeCode = 'ADT';
        // } else if (type === 'child') {
        //     this.passengerTypeCode = 'CHD';
        // } else if (type === 'infant') {
        //     this.passengerTypeCode = 'INF';
        // }
    }

}
