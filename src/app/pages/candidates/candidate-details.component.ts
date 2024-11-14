import {Component, Input, OnChanges, SimpleChanges, Type} from "@angular/core";
import {NgComponentOutlet} from "@angular/common";
import {Candidate} from "../../infrastructures/types/candidate";
import {CandidateFinalizationComponent} from "./candidate-finalization.component";
import {CvEvaluationComponent} from "./cv-evaluation.component";
import {InterviewFeedbackComponent} from "./interview-feedback.component";
import {InterviewPreparationComponent} from "./interview-preparation.component";
import {OnBoardingPreparationComponent} from "./onboarding-preparation.component";
import {RejectionLetterComponent} from "./rejection-letter.component";

@Component({
  selector: 'app-candidates-details',
  template: `
    <div class="candidate-details">
      <div>
        <h2>{{ candidate.firstName }} {{ candidate.lastName }}</h2>
        <p>Email: {{ candidate.email }}</p>
        <p>{{ candidate.position }}</p>
      </div>
      <ng-container *ngComponentOutlet="actionsSection; inputs: {candidateId: candidate.id}"></ng-container>
    </div>
  `,
  standalone: true,
  imports: [NgComponentOutlet],
})
export class CandidateDetailsComponent implements OnChanges {
  @Input() candidate!: Candidate;
  actionsSection: Type<any> | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if(changes['candidate']) {
      this.actionsSection = this.selectActionsComponent();
    }
  }

  private selectActionsComponent(): Type<any> {
    switch (this.candidate.status) {
      case 'CV evaluation':
        return CvEvaluationComponent;
      case 'Interview preparation':
        return InterviewPreparationComponent;
      case 'Interview feedback':
        return InterviewFeedbackComponent;
      case 'Rejected':
        return RejectionLetterComponent
      case 'Approved':
        return this.candidate.offerAccepted
          ? OnBoardingPreparationComponent
          : CandidateFinalizationComponent;
      default:
        throw new Error(`Unknown candidate status: ${this.candidate.status}`)
    }
  }
}
