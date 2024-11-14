import { Routes } from "@angular/router";
import {CandidateListComponent} from "./candidate-list.component";
import {CandidateDetailsComponent} from "./candidate-details.component";

export const routes: Routes = [
  {
    path: 'list',
    component: CandidateListComponent
  },
  {
    path: 'details/:id',
    component: CandidateDetailsComponent
  }
]
