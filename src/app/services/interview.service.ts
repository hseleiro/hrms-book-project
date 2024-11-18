import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Employee} from "../infrastructures/types/employee";

@Injectable()
export class InterviewService {
   private readonly http = inject(HttpClient);

  getInterviews(){
    return this.http.get<Employee[]>('/api/interviews');
  }

  createInterview(interviewer: Employee){
    return this.http.post<Employee>('/api/interviews', {interviewer});
  }
}
