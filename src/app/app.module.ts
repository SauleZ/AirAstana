import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {VexModule} from '../@vex/vex.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {CustomLayoutModule} from './custom-layout/custom-layout.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatIconModule} from '@angular/material/icon';
import {GeneralService} from './shared/api/general.service';
import {InterceptorModule} from './interceptor/interceptor.module';
import {AuthenticationService} from './shared/api/authentication.service';
import {CommunicationService} from '../@vex/services/communication/communication.service';
import {CommunicationModule} from '../@vex/services/communication/communication.module';

import localeEn from '@angular/common/locales/en';
import localeRu from '@angular/common/locales/ru';
import {registerLocaleData} from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {IntegrationService} from './shared/api/integration.service';
import {MatSelectCountryModule} from '@angular-material-extensions/select-country';

registerLocaleData(localeEn, 'en');
registerLocaleData(localeRu, 'ru');

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatIconModule,
        MatSelectCountryModule,
        InterceptorModule,
        InterceptorModule.forRoot(),
        CommunicationModule,
        CommunicationModule.forRoot(),
        // Vex
        VexModule,
        CustomLayoutModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        MatProgressSpinnerModule,
        // ServicesRoutingModule,
    ],
    providers: [GeneralService, IntegrationService, AuthenticationService, {provide: 'googleTagManagerId', useValue: 'GTM-MJJ7X8N'}],
    bootstrap: [AppComponent]
})
export class AppModule {
}
