import {Component, inject, OnDestroy, OnInit} from "@angular/core";
import {CandidateService} from "../../services/candidate.service";
import {AsyncPipe, NgForOf} from "@angular/common";
import {FormControl} from "@angular/forms";
import {createSearch} from "../../shared/functions/create-search";

@Component({
  selector: 'app-candidates-list',
  template: `
    <div>Candidate list</div>
    <table>
      <thead>
      <tr>
        <th>Full name</th>
        <th>Position</th>
      </tr>
      </thead>
      <tbody>
      <tr *ngFor="let candidate of candidates$ | async">
        <td>{{ candidate.firstName }} {{ candidate.lastName }}</td>
        <td>{{ candidate.position }}</td>
      </tr>
      </tbody>
    </table>
  `,
  imports: [
    NgForOf,
    AsyncPipe
  ],
  standalone: true
})
export class CandidateListComponent implements OnInit {
  private readonly candidateService = inject(CandidateService);
  candidates$ = this.candidateService.getCandidates();
  searchControl = new FormControl('')
  search$ = createSearch(this.searchControl)

  ngOnInit() {
    this.search$.subscribe((value) => {
      if(value) {
        this.candidates$ = this.candidateService.getCandidateByName(value)
      } else {
        this.candidates$ = this.candidateService.getCandidates()
      }
    })
  }
}
