import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { provideTranslateService, provideTranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthService } from './features/auth/auth-service';
import { firstValueFrom } from 'rxjs';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';
import { MessageService } from 'primeng/api';

registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './i18n/',
        suffix: '.json',
      }),
      lang: 'pl',
      fallbackLang: 'en',
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    })
  ],
};
