import {inject} from "@angular/core";
import {PermissionsService} from "../../services/permission.service";
import {filter, map, MonoTypeOperatorFunction, pipe, withLatestFrom} from "rxjs";
import {Permissions} from "../../infrastructures/types/permissions";

export function hasPermissions<T>(
  permissions: Permissions[],
  permissionsService = inject(PermissionsService)
): MonoTypeOperatorFunction<T> {

  return pipe(
    withLatestFrom(permissionsService.hasPermissions(permissions)),
    filter(([, hasPermissions]) => hasPermissions),
    map(([value]) => value)
  );

}
