import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FlightsComponent} from './flights.component';
import {FlexCalendarComponent} from './flex-calendar/flex-calendar.component';
import {FlightBoundsComponent} from './flight-bounds/flight-bounds.component';

const routes: Routes = [
    {
        path: '',
        component: FlightsComponent
    },
    {
        path: 'calendar',
        component: FlexCalendarComponent
    },
    {
        path: 'bounds',
        component: FlightBoundsComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FlightRoutingModule {
}
