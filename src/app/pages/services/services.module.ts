import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ServicesComponent} from './services.component';
import {ServicesRoutingModule} from './services-routing.module';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BaggageComponent} from './baggage/baggage.component';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {ConfigPanelModule} from '../../../@vex/components/config-panel/config-panel.module';
import {FlexLayoutModule, FlexModule} from '@angular/flex-layout';
import {BookingModule} from '../booking/booking.module';
import {SidebarModule} from '../../../@vex/components/sidebar/sidebar.module';
import {IconModule} from "@visurel/iconify-angular";
import {MatDividerModule} from "@angular/material/divider";
import {IconService} from '../../../@vex/services/icon.service';
import {OrderService} from '../../shared/api/order.service';
import {SeatmapService} from '../../shared/api/seatmap.service';
import { SpecialMealsComponent } from './special-meals/special-meals.component';
import {MatSelectModule} from "@angular/material/select";
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import { SpecialAssistanceComponent } from './special-assistance/special-assistance.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {LoaderModule} from '../../shared/loader/loader.module';
import { SeatmapComponent } from './seatmap/seatmap.component';
import { SeatInfoDialogComponent } from './seatmap/seat-info-dialog/seat-info-dialog.component';


@NgModule({
    declarations: [
        ServicesComponent,
        BaggageComponent,
        SpecialMealsComponent,
        SpecialAssistanceComponent,
        SeatmapComponent,
        SeatInfoDialogComponent
    ],
    exports: [
        ServicesComponent
    ],
    imports: [
        CommonModule,
        ServicesRoutingModule,
        MatCardModule,
        MatButtonModule,
        MatSidenavModule,
        MatIconModule,
        FormsModule,
        ConfigPanelModule,
        FlexModule,
        BookingModule,
        SidebarModule,
        IconModule,
        FlexLayoutModule,
        MatDividerModule,
        MatSelectModule,
        TranslateModule,
        MatDialogModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        LoaderModule
    ],
    entryComponents: [BaggageComponent, SeatInfoDialogComponent],
    providers: [IconService, OrderService, SeatmapService, TranslateService]
})
export class ServicesModule {
}
