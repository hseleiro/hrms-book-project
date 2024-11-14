import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, tap} from "rxjs";

@Injectable()
export class AuthService {
  private readonly http = inject(HttpClient);
  isAuth$ = new BehaviorSubject(false);

  login(credential: {email: string, password: string}) {
    return this.http.post('/api/auth/login', credential).pipe(
      tap(() => this.isAuth$.next(true))
    )
  }

  logout() {
    return this.http.post('api/auth/logout', {}).pipe(
      tap(() => this.isAuth$.next(false))
    )
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
