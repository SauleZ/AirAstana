import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {registerLocaleData} from '@angular/common';
import localeKz from '@angular/common/locales/kk'
registerLocaleData(localeKz, 'kz');

@Pipe({
  name: 'localizedDates',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {

  constructor(private translateService: TranslateService,
              private datePipe: DatePipe) {
  }

  transform(value: any, pattern: string = 'd MMM, y'): any {
    const date = this.datePipe.transform(value, pattern, undefined, this.translateService.currentLang);
    let index = date.indexOf(',');
    if (index === -1) index = date.indexOf('.');
    if (this.translateService.currentLang === 'kz' ) return date.slice(8, date.length-1);
    return date.slice(0, index);
  }

}
