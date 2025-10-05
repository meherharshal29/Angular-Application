import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from "ngx-spinner";
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        closeButton: true,
        preventDuplicates: true
      }),
      NgxSpinnerModule.forRoot() ,
      
    ),
  ]
};
