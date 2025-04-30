import { ApplicationConfig,importProvidersFrom ,provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { MatIconModule } from '@angular/material/icon';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
    withFetch(),                // ✅ Recomendado para SSR
    withInterceptorsFromDi()   // ✅ Usa los interceptores desde @Injectable
    ),
    importProvidersFrom(MatIconModule)
  ]
};
