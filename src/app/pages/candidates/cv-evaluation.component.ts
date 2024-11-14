import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-cv-evaluation',
  template: `
    <div>Cv evaluation</div>
  `,
  standalone: true
})
export class CvEvaluationComponent {
  @Input() candidateId!: number;
}
