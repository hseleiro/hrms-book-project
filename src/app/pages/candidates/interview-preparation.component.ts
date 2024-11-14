import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-interview-preparation',
  template: `
    <div>App interview preparation</div>
  `,
  standalone: true
})
export class InterviewPreparationComponent {
  @Input() candidateId!: number;
}
