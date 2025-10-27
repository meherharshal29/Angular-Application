import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling
} from '@angular/router';
import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import {
  BrowserAnimationsModule,
  provideAnimations
} from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { JwtInterceptor } from './auth/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ Router with extra options
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      }),
      withComponentInputBinding()
    ),

    // ✅ HTTP client with JWT interceptor support
    provideHttpClient(withFetch(), withInterceptorsFromDi()),

    // ✅ Animations and Hydration
    provideAnimations(),
    provideClientHydration(withEventReplay()),

    // ✅ BrowserAnimationsModule (needed for Toastr)
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        closeButton: true,
        preventDuplicates: true
      }),
      NgxSpinnerModule.forRoot()
    ),

    // ✅ JWT interceptor registration
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
  ]
};
