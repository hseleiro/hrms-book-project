import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {TimeOffRequest} from "../infrastructures/types/time-off-request.type";

@Injectable()
export class TimeOffRequestsService {

  private readonly http = inject(HttpClient);

  getRequests() {
    return this.http.get<TimeOffRequest[]>('http://localhost:8080/requests');
  }

  deleteRequest(requestId: number) {
    return this.http.delete<TimeOffRequest>('http://localhost:8080/requests')
  }

}
