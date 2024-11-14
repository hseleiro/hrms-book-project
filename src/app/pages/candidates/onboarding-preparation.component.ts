import {Component, Input} from "@angular/core";

@Component({
  selector: 'app-onboarding-preparation',
  template: `
    <div>App onboarding preparation</div>
  `,
  standalone: true
})
export class OnBoardingPreparationComponent {
  @Input() candidateId!: number;
}
