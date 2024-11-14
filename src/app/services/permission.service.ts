import {Injectable} from "@angular/core";
import {BehaviorSubject, map} from "rxjs";
import {Permissions} from "../infrastructures/types/permissions";

@Injectable({providedIn: 'root'})
export class PermissionsService {
  private readonly permissions$ = new BehaviorSubject<Partial<Record<Permissions, boolean>>>({
    ViewEmployees: true,
  });

  hasPermission(permission: Permissions) {
    return this.permissions$.pipe(map(permissions => permissions[permission] ?? false));
  }

  setPermissions(permissions: Partial<Record<Permissions, boolean>>) {
    this.permissions$.next({...this.permissions$.getValue(), ...permissions});
  }

  revokePermission(permission: Permissions) {
    this.permissions$.next({...this.permissions$.getValue(), [permission]: false});
  }

  hasPermissions(permissions: Permissions[]) {
    return this.permissions$.pipe(
      map(currentPermissions =>
        permissions.every(permission => currentPermissions[permission] ?? false)
      )
    );
  }
}
