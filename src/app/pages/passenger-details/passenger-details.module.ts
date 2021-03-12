import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PassengerDetailsComponent} from './passenger-details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {BookingModule} from '../booking/booking.module';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {PassengerDetailsRoutingModule} from './passenger-details-routing.module';
import {IconModule} from '@visurel/iconify-angular';
import {IconService} from '../../../@vex/services/icon.service';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoaderModule} from '../../shared/loader/loader.module';
import {MatDatepicker, MatDatepickerModule, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MomentDateModule} from '@angular/material-moment-adapter';
import {Ng2TelInputModule} from 'ng2-tel-input';
import {MatSelectCountryLangToken, MatSelectCountryModule} from "@angular-material-extensions/select-country";
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";

@NgModule({
    declarations: [PassengerDetailsComponent],
    imports: [
        CommonModule,
        PassengerDetailsRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        FormsModule,
        BookingModule,
        MatCheckboxModule,
        FlexLayoutModule,
        MatCardModule,
        DeviceDetectorModule,
        FlexModule,
        IconModule,
        TranslateModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        LoaderModule,
        MatDatepickerModule,
        MomentDateModule,
        MatNativeDateModule,
        Ng2TelInputModule,
        MatSelectCountryModule,
        NgxIntlTelInputModule
    ],
    providers: [IconService, TranslateService,
        {
            provide: MatSelectCountryLangToken,
            useValue: {
                collapsedHeight: '100px',
                expandedHeight: '100px',
                hideToggle: true
            }
        }
        ],
    exports: [
        PassengerDetailsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PassengerDetailsModule {
}
