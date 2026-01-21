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
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { AuthService } from './features/auth/auth-service';
import { firstValueFrom } from 'rxjs';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { errorInterceptor } from './core/interceptors/error-interceptor';

registerLocaleData(localePl);

export const appConfig: ApplicationConfig = {
  providers: [
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
    }),
    provideHotToastConfig({
      stacking: 'depth',
      visibleToasts: 6,
      duration: 3000,
      success: {
        style: {
          background: 'hsl(143, 85%, 96%)',
          borderColor: 'hsl(145, 92%, 87%)',
          color: 'hsl(140, 100%, 27%)',
        },
      },
      error: {
        style: {
          background: 'hsl(359, 100%, 97%)',
          borderColor: 'hsl(359, 100%, 94%)',
          color: 'hsl(360, 100%, 45%)',
        },
      },
      info: {
        style: {
          background: 'hsl(208, 100%, 97%)',
          borderColor: 'hsl(221, 91%, 93%)',
          color: 'hsl(210, 92%, 45%)',
        },
      },
    }),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      try {
        return await firstValueFrom(authService.checkAuth());
      } catch {
        return false;
      }
    }),
  ],
};
