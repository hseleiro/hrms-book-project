import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';

import { routes } from './app.routes';
import {authInterceptor} from "./shared/interceptors/auth.interceptor";
import {TruncateLimit} from "./shared/directives/truncate.directive";
import {employeePermissionsInterceptor} from "./shared/interceptors/employee-permissions.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    { provide : TruncateLimit, useValue: 70 },
    provideHttpClient(withFetch()),
    provideHttpClient(withInterceptors([
      authInterceptor,
      employeePermissionsInterceptor
    ])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
  ]
};
