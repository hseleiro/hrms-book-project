import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-candidates-finalization',
  template: `
    <div>App candidate finalization</div>
  `,
  standalone: true
})
export class CandidateFinalizationComponent {
  @Input() candidateId!: number;
}
