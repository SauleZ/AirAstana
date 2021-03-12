import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BookingComponent} from './booking.component';
import {BookingRoutingModule} from './booking-routing.module';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {ContainerModule} from '../../../@vex/directives/container/container.module';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {IconModule} from '@visurel/iconify-angular';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {BookingModalComponent} from './booking-modal/booking-modal.component';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {IconService} from '../../../@vex/services/icon.service';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LoaderModule} from '../../shared/loader/loader.module';
import {LocalizedDateModule} from '../../../@vex/pipes/localized-date/localized-date.module';
import {registerLocaleData} from '@angular/common';
import localeKz from '@angular/common/locales/kk'
import localeRu from '@angular/common/locales/ru'
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [BookingComponent, BookingModalComponent],
    exports: [
        BookingComponent
  ],
    imports: [
        CommonModule,
        BookingRoutingModule,
        FlexModule,
        ContainerModule,
        MatExpansionModule,
        MatIconModule,
        IconModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
        MatDialogModule,
        DeviceDetectorModule,
        FlexLayoutModule,
        MatCheckboxModule,
        TranslateModule,
        LoaderModule,
        LocalizedDateModule
    ],
    providers: [
        {
            provide: MatDialogRef,
            useValue: {}
        },
        {
            provide: IconService,
            useValue: {}
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {}
        },
        {
            provide: TranslateService,
            useClass: TranslateService
        }
    ],
    entryComponents: [BookingModalComponent]
})
export class BookingModule {
    constructor() {
        registerLocaleData(localeKz, 'kz');
        registerLocaleData(localeRu, 'ru');
    }
}
