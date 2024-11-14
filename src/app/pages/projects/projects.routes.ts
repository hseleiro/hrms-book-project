import {Routes} from "@angular/router";
import {ProjectDetailsComponent} from "./project-details.component";
import { ProjectListComponent } from "./project-list.component";

export const routes: Routes = [
  { path: 'list', component: ProjectListComponent },
  { path: 'projects/:id', component: ProjectDetailsComponent }
]
