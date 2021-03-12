import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizedDatePipe } from './localized-date.pipe';



@NgModule({
    declarations: [LocalizedDatePipe],
    exports: [
        LocalizedDatePipe
    ],
    imports: [
        CommonModule
    ]
})
export class LocalizedDateModule { }
