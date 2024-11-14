import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login.component";
import {EmployeeService} from "./services/employee.service";
import {authGuard} from "./shared/guards/auth.guard";
import {CandidateService} from "./services/candidate.service";

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', loadComponent: async () => {
      const m = await import('./pages/registration.component');
      return m.RegistrationComponent;
    } },
  {
    path: 'employees',
    providers: [EmployeeService],
    canActivate: [authGuard],
    loadChildren: async () => {
      const m = await import('./pages/employees/employees.routes');
      return m.routes;
    }
  },
  {
    path: 'candidates',
    providers: [CandidateService],
    canActivate: [authGuard],
    loadChildren: async () => {
      const m = await import('./pages/candidates/candidates.routes');
      return m.routes;
    }
  },
  {
    path: 'projects',
    loadChildren: async () => {
      const m = await import('./pages/projects/projects.routes');
      return m.routes;
    }
  }
];
