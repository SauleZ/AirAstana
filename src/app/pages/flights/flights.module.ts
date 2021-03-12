import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FlightsComponent} from './flights.component';
import {FlightRoutingModule} from './flight-routing.module';
import {ExtendedModule, FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {BookingModule} from '../booking/booking.module';
import {IconModule} from '@visurel/iconify-angular';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatIconModule} from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import {FlightsRatesComponent} from './flights-rates/flights-rates.component';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {FlightRouteComponent} from './flight-route/flight-route.component';
import {MatSelectModule} from '@angular/material/select';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {DetailsHeaderComponent} from './details-header/details-header.component';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {FlightService} from './flight.service';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {IconService} from '../../../@vex/services/icon.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {HttpClientModule} from '@angular/common/http';
import {CalendarService} from '../../shared/api/calendar.service';
import {InterceptorModule} from '../../interceptor/interceptor.module';
import {OfferService} from '../../shared/api/offer.service';
import {DictionaryService} from '../../shared/api/dictionary.service';
import {FlexCalendarComponent} from './flex-calendar/flex-calendar.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {FlightBoundsComponent} from './flight-bounds/flight-bounds.component';
import {GlobalFilterComponent} from './flex-calendar/global-filter/global-filter.component';
import {TrustHtmlPipe} from './trust-html-pipe.pipe';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LocalizedDateModule} from '../../../@vex/pipes/localized-date/localized-date.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LoaderModule} from '../../shared/loader/loader.module';
import {registerLocaleData} from '@angular/common';
import localeKz from '@angular/common/locales/kk'
import localeRu from '@angular/common/locales/ru'
import {CryptoService} from '../../utils/crypto.service';
import {ExternalService} from '../../shared/api/external.service';

@NgModule({
    declarations: [
        FlightsComponent,
        FlightsRatesComponent,
        FlightRouteComponent,
        DetailsHeaderComponent,
        FlexCalendarComponent,
        FlightBoundsComponent,
        GlobalFilterComponent,
        TrustHtmlPipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FlightRoutingModule,
        FlexModule,
        FlexLayoutModule,
        BookingModule,
        IconModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
        MatExpansionModule,
        MatGridListModule,
        MatStepperModule,
        MatDividerModule,
        MatCardModule,
        MatListModule,
        MatSelectModule,
        FormsModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatButtonModule,
        MatRadioModule,
        DeviceDetectorModule,
        ExtendedModule,
        MatTooltipModule,
        InterceptorModule,
        InterceptorModule.forRoot(),
        TranslateModule,
        LocalizedDateModule,
        MatProgressSpinnerModule,
        LoaderModule
    ],
    providers: [
        {
            provide: MatDialogRef,
            useValue: {}
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {}
        },
        {
            provide: FlightService,
            useValue: {}
        },
        {
            provide: DictionaryService,
            useClass: DictionaryService
        },
        {
            provide: IconService,
            useClass: IconService
        },
        {
            provide: TranslateService,
            useClass: TranslateService
        },
        {
            provide: CalendarService,
            useClass: CalendarService
        },
        {
            provide: OfferService,
            useClass: OfferService
        },
        {
            provide: DatePipe,
            useClass: DatePipe
        },
        {
            provide: CryptoService,
            useClass: CryptoService
        },
        {
            provide: ExternalService,
            useClass: ExternalService
        }
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
        DetailsHeaderComponent
    ],
    entryComponents: [DetailsHeaderComponent, FlightsComponent, GlobalFilterComponent]
})
export class FlightsModule {
    constructor() {
        registerLocaleData(localeKz, 'kz');
        registerLocaleData(localeRu, 'ru');
    }
}
