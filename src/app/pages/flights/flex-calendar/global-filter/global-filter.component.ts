import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {IconService} from '../../../../../@vex/services/icon.service';
import {CryptoService} from '../../../../utils/crypto.service';

@Component({
    selector: 'vex-global-filter',
    templateUrl: './global-filter.component.html',
    styleUrls: ['./global-filter.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GlobalFilterComponent {

    form: any = {};

    constructor(
        public dialogRef: MatDialogRef<GlobalFilterComponent>,
        public iconService: IconService,
        private _cryptoService: CryptoService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        if (localStorage.getItem('filterForm')) {
            this.form = this._cryptoService.decryptData(localStorage.getItem('filterForm'));
        }
    }

    apply(): void {
        if (this.form.toCode && this.form.fromCode) {
            localStorage.setItem('filterForm', this._cryptoService.encryptData(this.form));
            this.dialogRef.close(this.form);
        } else {
            this.dialogRef.close();
        }
    }

    close(): void {
        this.dialogRef.close();
    }

}
