import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomLayoutComponent} from './custom-layout/custom-layout.component';
import {AuthGuard} from './interceptor/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: CustomLayoutComponent,
        children: [
            {
                path: '',
                loadChildren: () => import('./pages/flights/flights.module').then(m => m.FlightsModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'passenger',
                loadChildren: () => import('./pages/passenger-details/passenger-details.module').then(m => m.PassengerDetailsModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'services',
                loadChildren: () => import('./pages/services/services.module').then(m => m.ServicesModule),
                canActivate: [AuthGuard]
            },
            {
                path: 'summary',
                loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // preloadingStrategy: PreloadAllModules,
        scrollPositionRestoration: 'enabled',
        relativeLinkResolution: 'corrected',
        anchorScrolling: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
