import { inject } from "@angular/core";
import {EmployeeService} from "../../services/employee.service";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";

export const employeeDetailResolver: ResolveFn<EmployeeService> = ( route: ActivatedRouteSnapshot) => {
  const employeeService = inject(EmployeeService);
  const id = +(route.paramMap.get('id') ?? 0);
  return employeeService.getEmployee(id);
}
