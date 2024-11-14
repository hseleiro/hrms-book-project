import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-interview-feedback',
  template: `
    <div>App interview feedback</div>
  `,
  standalone: true
})
export class InterviewFeedbackComponent {
  @Input() candidateId!: number
}
