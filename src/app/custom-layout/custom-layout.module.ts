import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from '../../@vex/layout/layout.module';
import {CustomLayoutComponent} from './custom-layout.component';
import {SidenavModule} from '../../@vex/layout/sidenav/sidenav.module';
import {ToolbarModule} from '../../@vex/layout/toolbar/toolbar.module';
import {FooterModule} from '../../@vex/layout/footer/footer.module';
import {ConfigPanelModule} from '../../@vex/components/config-panel/config-panel.module';
import {SidebarModule} from '../../@vex/components/sidebar/sidebar.module';
import {QuickpanelModule} from '../../@vex/layout/quickpanel/quickpanel.module';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {NavigationModule} from '../../@vex/layout/navigation/navigation.module';
import {ServicesModule} from '../pages/services/services.module';
import {BookingModule} from '../pages/booking/booking.module';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
    declarations: [CustomLayoutComponent],
    imports: [
        CommonModule,
        LayoutModule,
        SidenavModule,
        ToolbarModule,
        FooterModule,
        ConfigPanelModule,
        SidebarModule,
        QuickpanelModule,
        CdkStepperModule,
        NavigationModule,
        ServicesModule,
        BookingModule,
        FlexModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomLayoutModule {
}
