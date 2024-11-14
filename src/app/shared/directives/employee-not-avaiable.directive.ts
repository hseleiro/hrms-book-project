import {NgClass} from "@angular/common";
import {AfterViewInit, Directive, inject} from "@angular/core";
import { RouterLink } from "@angular/router";
import {EmployeeService} from "../../services/employee.service";
import {TooltipDirective} from "./tooltip.directive";

@Directive({
  selector: 'a[routerLink]',
  hostDirectives: [NgClass, {directive: TooltipDirective, inputs: ['tooltip']}],
  standalone: true,
})
export class EmployeeNotAvailableDirective implements AfterViewInit {
  private readonly ngClassRef = inject(NgClass);
  private readonly tooltipRef = inject(TooltipDirective);
  private readonly routerLinkRef = inject(RouterLink);
  private readonly employeeService = inject(EmployeeService);

  ngAfterViewInit() {
    if(this.routerLinkRef.href!.startsWith('/employees/details')) {
      const employeeId = this.routerLinkRef.urlTree?.root.children['primary']?.segments.at(-1)?.path;

      if(employeeId) {
        this.employeeService.getEmployee(+employeeId).subscribe(employee => {
          this.ngClassRef.ngClass = {'not-available': !employee.isAvaiable }
          this.tooltipRef.tooltip = employee.isAvaiable ? '' : 'Employee is not available';
        });
      }
    }
  }

}
