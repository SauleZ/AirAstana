import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ToolbarComponent} from './toolbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatRippleModule} from '@angular/material/core';
import {ToolbarNotificationsModule} from './toolbar-notifications/toolbar-notifications.module';
import {ToolbarUserModule} from './toolbar-user/toolbar-user.module';
import {ToolbarSearchModule} from './toolbar-search/toolbar-search.module';
import {IconModule} from '@visurel/iconify-angular';
import {NavigationModule} from '../navigation/navigation.module';
import {RouterModule} from '@angular/router';
import {NavigationItemModule} from '../../components/navigation-item/navigation-item.module';
import {MegaMenuModule} from '../../components/mega-menu/mega-menu.module';
import {ContainerModule} from '../../directives/container/container.module';
import {FormsModule} from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {MatCardModule} from '@angular/material/card';
import {ToolbarSortFilterComponent} from './toolbar-sort-filter/toolbar-sort-filter.component';
import {TranslateModule, TranslateService} from '@ngx-translate/core';


@NgModule({
    declarations: [ToolbarComponent, ToolbarSortFilterComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatRippleModule,
        ToolbarNotificationsModule,
        ToolbarUserModule,
        ToolbarSearchModule,
        IconModule,
        NavigationModule,
        RouterModule,
        NavigationItemModule,
        MegaMenuModule,
        ContainerModule,
        FormsModule,
        MatDividerModule,
        CdkStepperModule,
        MatCardModule,
        TranslateModule
    ],
    exports: [ToolbarComponent],
    providers: [TranslateService]
})
export class ToolbarModule {
}
