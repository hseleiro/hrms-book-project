import {Component, DestroyRef, inject, OnInit} from "@angular/core";
import {EmployeeService} from "../../services/employee.service";
import {FormControl, FormGroup, FormsModule, Validators} from "@angular/forms";
import {Employee} from "../../infrastructures/types/employee";
import {PermissionsService} from "../../services/permission.service";
import {EmployeeForm} from "../../infrastructures/types/employee-form";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'edit-employee',
  template: `
    <h1>Edit employee</h1>
  `,
  standalone: true,
  imports: [FormsModule],
  providers: [],
})
export class EditEmployeeComponent implements OnInit {
  permissionsService = inject(PermissionsService);
  destroyRef = inject(DestroyRef)
  form = new FormGroup<EmployeeForm>({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    lastName: new FormControl('', {nonNullable: true}),
    email: new FormControl('', {nonNullable: true}),
    position: new FormControl('', {nonNullable: true}),
    level: new FormControl('', {nonNullable: true})
  })

  ngOnInit() {
    this.permissionsService.hasPermission('EditEmployeePrivateDetails').pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(hasPermission => {
      if(!hasPermission) {
        this.form.controls.firstName.disable();
        this.form.controls.lastName.disable();
        this.form.controls.email.disable();
      } else {
        this.form.controls.firstName.enable();
        this.form.controls.lastName.enable();
        this.form.controls.email.enable();
      }
    })
  }
}
