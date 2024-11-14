import { Router } from "@angular/router";
import {inject} from "@angular/core";
import {map, Observable} from "rxjs";
import {GuardsService} from "../../services/guards.service";

export const permissionGuard: (permission: string) => Observable<Object> = (permission: string) => {
  const router = inject(Router);
  const guardsService = inject(GuardsService);

  return guardsService.hasPermission(permission).pipe(
    map((permission) => permission ?? router.navigate(['/login']))
  )
}
