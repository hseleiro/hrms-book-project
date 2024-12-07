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
  },
  {
    path: 'time',
    loadComponent: async () => {
      const m = await import('./pages/work/time-off-management.component');
      return m.TimeOffManagementComponent;
    }
  },
  {
    path: 'observable', loadComponent: async() => {
      const component = await import('./pages/work/observable-test')
      return component.ObservableTestComponent;
    },
  },
  {
    path: 'teste',
    loadComponent: async () => {
      const component = await import('./pages/work/observable-test');
      return component.ObservableTestComponent
    }
  },
  {
    path: 'unit',
    loadComponent: async () => {
      const component = await import('./pages/work/unit-test.component');
      return component.UnitTestComponent;
    },
  },
  {
    path: 'observable-multiselect',
    loadComponent: async () => {
      const component = await import('./pages/work/observable-multiselect');
      return component.ObservableMultiSelectComponent
    }
  },
  {
    path: 'signal-multiselect',
    loadComponent: async () => {
      const component = await import('./pages/work/signals-multiselect');
      return component.SignalsMultiselectComponent;
    }
  }

];
