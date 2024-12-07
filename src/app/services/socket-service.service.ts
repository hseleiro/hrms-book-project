import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Notification} from "../infrastructures/types/notifications";

@Injectable({providedIn: "root"})
export class SocketService {

  private readonly http = inject(HttpClient);

  notifications$ = this.http.get<Notification[]>('http://localhost:8080/notifications');

}
