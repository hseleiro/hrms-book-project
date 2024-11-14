import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-rejection-letter',
  template: `
    <div>App rejection letter</div>
  `,
  standalone: true
})
export class RejectionLetterComponent {
  @Input() candidateId!: number;
}
