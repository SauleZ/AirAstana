import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryRoutingModule } from './summary-routing.module';
import { SummaryComponent } from './summary.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatExpansionModule} from '@angular/material/expansion';
import {FlightsModule} from '../flights/flights.module';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {BookingModule} from '../booking/booking.module';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {LocalizedDateModule} from '../../../@vex/pipes/localized-date/localized-date.module';


@NgModule({
  declarations: [SummaryComponent],
    imports: [
        CommonModule,
        SummaryRoutingModule,
        FlexLayoutModule,
        MatExpansionModule,
        FlightsModule,
        MatTooltipModule,
        MatCardModule,
        MatSelectModule,
        MatButtonModule,
        BookingModule,
        TranslateModule,
        LocalizedDateModule
    ],
    providers: [TranslateService]
})
export class SummaryModule { }
