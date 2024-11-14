import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {hasPermissions} from "../operators/has-permissions.operator";
import {hisAuthorized} from "../operators/has-authorization.operator";

export const employeePermissionsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    hisAuthorized(),
    hasPermissions(['CreateEmployee', 'DeleteEmployee', 'EditEmployeeGeneralDetails', 'ViewEmployees']),
  );
};
