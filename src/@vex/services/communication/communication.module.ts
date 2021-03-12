import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommunicationService} from './communication.service';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    providers: [
        CommunicationService
    ]
})
export class CommunicationModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CommunicationModule,
            providers: [
                {
                    provide: CommunicationService,
                    useClass: CommunicationService,
                    multi: false
                }
            ]
        };
    }

}
