import {Component, inject} from "@angular/core";
import {NgIf, NgOptimizedImage} from "@angular/common";
import { Employee } from "../../infrastructures/types/employee";
import {ActivatedRoute} from "@angular/router";
import {TruncateDirective} from "../../shared/directives/truncate.directive";
import {UserBadgeComponent} from "../../shared/components/user-badge.component";

@Component({
  selector: 'employee-details',
  template: `
    <h1>Employee details</h1>
    <img [ngSrc]="employee.profilePicture" width="100" height="100" alt="" priority/>
    <app-user-badge [icons]="icons"/>
    <p>Employee name: {{ employee.firstName }}</p>
    <p>Employee name: {{ employee.lastName }}</p>
    <p>Employee Email: {{ employee.position }}</p>
    <td appTruncate [limit]="10"></td>
  `,
  standalone: true,
  imports: [
    NgIf,
    TruncateDirective,
    NgOptimizedImage,
    UserBadgeComponent,
  ],
  providers: [],
})
export class EmployeeDetailsComponent {
  employee = inject(ActivatedRoute).snapshot.data['employee'] as Employee;
  icons = ['admin','employee', 'HR team'];
}
