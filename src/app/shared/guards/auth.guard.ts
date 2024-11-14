import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import { AuthService } from "../../services/auth.service";
import {map} from "rxjs";

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.isAuth$.pipe(
    map((isAuth) => isAuth || router.createUrlTree(['/login']))
  )
}
