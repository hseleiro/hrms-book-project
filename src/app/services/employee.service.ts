import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class EmployeeService {
  private readonly http = inject(HttpClient);

  getEmployees() {
    return this.http.get<any>('/api/employees');
  }

  createEmployee(employee: any) {
    return this.http.post<any>('/api/employees', {employee});
  }

  editEmployee(employee: {firstName: string, email: string}) {
    return this.http.put<any>('/api/employees', {employee});
  }

  getEmployee(id: number) {
    return this.http.get<any>(`/api/employees/${id}`);
  }
}
