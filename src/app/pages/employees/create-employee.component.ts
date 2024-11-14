import {Component, inject} from "@angular/core";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {EmployeeService} from "../../services/employee.service";
import {Employee} from "../../infrastructures/types/employee";
import {EmployeeForm} from "../../infrastructures/types/employee-form";

@Component({
  selector: 'create-employee',
  template: `
    <h1>Create employee</h1>
    <form>
      <input type="text" placeholder="Email" [formControl]="form.controls.email" />
    </form>
    <!--<form>
      <input type="text" name="firstName" placeholder="Employee first name" [(ngModel)]="employee.firstName">
      <input type="text" name="email" placeholder="Employee email" [(ngModel)]="employee.email">
      <button type="submit" (click)="createEmployee()">Create employee</button>
    </form>-->
  `,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: []
})
export class CreateEmployeeComponent {
  private readonly employeeService = inject(EmployeeService);

  form = new FormGroup<EmployeeForm>({
    firstName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    lastName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    position: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    level: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  });

  submit() {
    if (this.form.valid) {
      const employee = this.form.value as Employee;
      this.employeeService.createEmployee(employee);
    }
  }

  /*employee: Employee ={
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    position: 'Developer',
    level: 'Junior',
    isAvailable: true,
    profilePicture: ''
  };

  createEmployee() {
    this.employeeService.createEmployee(this.employee);
  }*/

}
