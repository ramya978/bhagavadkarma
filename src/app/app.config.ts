import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      // Routes are lazy-loaded (see app.routes.ts). PreloadAllModules quietly
      // downloads the route chunks in the background after the first paint, so
      // the initial bundle stays small while navigation remains instant.
      withPreloading(PreloadAllModules)
    ),
  ],
};
