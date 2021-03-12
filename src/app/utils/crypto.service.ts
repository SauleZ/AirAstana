import * as CryptoJS from 'crypto-js';
import {Injectable} from '@angular/core';
import {Secret} from '../shared/constants/secret';

@Injectable({
    providedIn: 'root'
})
export class CryptoService {

    private readonly SECRET_KEY = Secret.getKey();

    public encryptData(data): string {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(data), this.SECRET_KEY).toString();
        } catch (e) {
            console.log(e);
        }
    }

    public decryptData(data): any {
        try {
            const bytes = CryptoJS.AES.decrypt(data, this.SECRET_KEY);
            if (bytes.toString()) {
                return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            }
            return data;
        } catch (e) {
            console.log(e);
        }
    }



}
