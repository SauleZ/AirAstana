import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from '../shared/api/authentication.service';
import {AuthInterceptor} from './auth.interceptor';
import {IntegrationService} from '../shared/api/integration.service';
import {CryptoService} from '../utils/crypto.service';
import {RouterModule, Routes} from '@angular/router';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    HttpClient,
    AuthenticationService,
    IntegrationService,
    CryptoService,
    RouterModule
  ]
})
export class InterceptorModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: InterceptorModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    };
  }

}
