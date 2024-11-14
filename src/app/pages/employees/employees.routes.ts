import {Routes} from "@angular/router";
import {EmployeeListComponent} from "./employee-list.component";
import {EmployeeDetailsComponent} from "./employee-details.component";
import {CreateEmployeeComponent} from "./create-employee.component";
import {EditEmployeeComponent} from "./edit-employee.component";
import {permissionGuard} from "../../shared/guards/permission.guard";
import {employeeDetailResolver} from "../../shared/resolvers/emplyee.detail.resolver";

export const routes: Routes = [
  {
    path: 'list',
    component: EmployeeListComponent,
    canActivate: [permissionGuard('list')]
  },
  {
    path: 'details/:id',
    component: EmployeeDetailsComponent,
    resolve: {employee: employeeDetailResolver},
    canActivate: [permissionGuard('detail')]
  },
  {
    path: 'create',
    component: CreateEmployeeComponent,
    canActivate: [permissionGuard('create')]
  },
  {
    path: 'edit',
    component: EditEmployeeComponent,
    canActivate: [permissionGuard('edit')]
  },
]
