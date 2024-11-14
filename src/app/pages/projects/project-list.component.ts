import {Component, inject} from "@angular/core";
import {ProjectCardComponent} from "../../shared/components/project-card.component";
import {AsyncPipe, NgFor} from "@angular/common";
import {ProjectService} from "../../services/project.service";

@Component({
  selector: 'app-projects-list',
  template: `
    <div class="row">
      <app-project-card
        *ngFor="let project of projects$ | async"
        [projectId]="project.id"
      />
    </div>
  `,
  standalone: true,
  imports: [NgFor, ProjectCardComponent, AsyncPipe],
})
export class ProjectListComponent {
  private readonly projectService = inject(ProjectService);
  projects$ = this.projectService.getProjects();
}
