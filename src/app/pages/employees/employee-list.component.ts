import {Component, inject} from "@angular/core";
import {AsyncPipe, NgComponentOutlet, NgFor, NgIf, NgOptimizedImage} from "@angular/common";
import {EmployeeService} from "../../services/employee.service";
import {Constants} from "../../shared/constants";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-employee-list',
  template: `
  <h2>Employee List</h2>
  <table>
    <thead>
    <tr>
      <th>Full Name</th>
      <th>Position</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
      <tr *ngFor="let employee of employee$ | async">
        <td>
          <img
            [ngSrc]="employee.profilePicture"
            width="20" height="20"  alt=""/>
            <a [routerLink]="['/employee/details', employee.id]">
              <td>{{employee.firstName}} {{employee.lastName}}</td>
            </a>
        </td>
        <td>{{employee.position}}</td>
        <td>
          <button (click)="showConfirmationDialog()">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ng-container *ngComponentOutlet="confirmDialog"></ng-container>
  `,
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, NgComponentOutlet, NgOptimizedImage, RouterLink],
})
export class EmployeeListComponent {
  //private readonly constants = inject(Constants);
  private readonly employeeService = inject(EmployeeService);
  readonly employee$ = this.employeeService.getEmployees();
  isConfirmationOpen = false;
  confirmDialog: any = null;

  async showConfirmationDialog() {
    this.confirmDialog = await import(
      '../../shared/components/confirmation-dialog.component'
      ).then((m) => m.ConfirmationDialogComponent);
    this.isConfirmationOpen = true;
  }
}
