import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class GuardsService {
  private readonly http = inject(HttpClient);

  hasPermission(permission: string) {
    return this.http.get(`/api/auth/permissions/${permission}`);
  }
}
