import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHotToastConfig } from '@ngxpert/hot-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideCharts(withDefaultRegisterables()),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }), provideHotToastConfig({
      stacking: "depth",
      visibleToasts: 6,
      duration: 3000,
      success: {
        style: {
          background: 'hsl(143, 85%, 96%)',
          borderColor: 'hsl(145, 92%, 87%)',
          color: 'hsl(140, 100%, 27%)',
        }
      },
      error: {
        style: {
          background: 'hsl(359, 100%, 97%)',
          borderColor: 'hsl(359, 100%, 94%)',
          color: 'hsl(360, 100%, 45%)',
        }
      },
      info: {
        style: {
          background: 'hsl(208, 100%, 97%)',
          borderColor: 'hsl(221, 91%, 93%)',
          color: 'hsl(210, 92%, 45%)',
        }
      }
    })
  ]
};
