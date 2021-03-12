import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationComponent} from './navigation.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatRippleModule} from '@angular/material/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {IconModule} from '@visurel/iconify-angular';
import {RouterModule} from '@angular/router';
import {NavigationItemModule} from '../../components/navigation-item/navigation-item.module';
import {ContainerModule} from '../../directives/container/container.module';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {CustomStepperComponent} from './custom-stepper/custom-stepper.component';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {FlightsModule} from '../../../app/pages/flights/flights.module';
import {ServicesModule} from '../../../app/pages/services/services.module';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {Ng5SliderModule} from 'ng5-slider';
import {FormsModule} from '@angular/forms';
import {FilterMobileComponent} from './filter-mobile/filter-mobile.component';
import {SortingMobileComponent} from './sorting-mobile/sorting-mobile.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LocalizedDateModule} from '../../pipes/localized-date/localized-date.module';

@NgModule({
    declarations: [NavigationComponent, CustomStepperComponent, FilterMobileComponent, SortingMobileComponent],
    imports: [
        CommonModule,
        FormsModule,
        FlexLayoutModule,
        MatRippleModule,
        MatMenuModule,
        MatIconModule,
        IconModule,
        RouterModule,
        NavigationItemModule,
        ContainerModule,
        MatButtonModule,
        MatStepperModule,
        CdkStepperModule,
        FlightsModule,
        ServicesModule,
        DeviceDetectorModule,
        MatCardModule,
        MatSlideToggleModule,
        MatSliderModule,
        Ng5SliderModule,
        TranslateModule,
        LocalizedDateModule
    ],
    exports: [NavigationComponent, CustomStepperComponent],
    providers: [TranslateService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavigationModule {
}
