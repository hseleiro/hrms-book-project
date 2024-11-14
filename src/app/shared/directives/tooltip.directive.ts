import {Directive, Input} from "@angular/core";

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective {
  @Input() tooltip: string = '';
}
