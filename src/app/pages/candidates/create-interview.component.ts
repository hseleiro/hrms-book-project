import {Component, inject} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Employee} from "../../infrastructures/types/employee";
import {InterviewService} from "../../services/interview.service";

@Component({
  selector: 'create-candidates',
  template: `
    <div>Create Interview</div>
    <form>
      <input type="text" placeholder="Interviewer name" [(ngModel)]="interviewer.firstName"/>
      <input type="email" placeholder="Interviewer email" [(ngModel)]="interviewer.email"/>
      <input type="text" placeholder="Interviewer position" [(ngModel)]="interviewer.position" />
      <button type="submit" (click)="createInterview()">Create interview</button>
    </form>
  `,
  standalone: true,
  imports: [FormsModule],
  providers: [],
})
export class CreateInterviewComponent {
  private readonly interviewService = inject(InterviewService);

  interviewer: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    position: 'Developer',
    level: 'Junior',
    isAvailable: true,
    profilePicture: ''
  };

  createInterview() {
    this.interviewService.createInterview(this.interviewer);
  }

}
