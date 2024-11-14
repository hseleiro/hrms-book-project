import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class CandidateService {
  private readonly http = inject(HttpClient);

  getCandidates() {
    return this.http.get<any>('/api/candidates');
  }

  getCandidateByName(value: string) {
    return this.http.get<any>(`/api/candidates?name=${value}`);
  }
}
