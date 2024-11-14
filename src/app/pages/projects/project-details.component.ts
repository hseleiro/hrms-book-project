import {AsyncPipe, NgFor, NgIf} from "@angular/common";
import {ProjectCardComponent} from "../../shared/components/project-card.component";
import {Component, inject, Input, numberAttribute, OnChanges, SimpleChanges} from "@angular/core";
import {Observable } from "rxjs";
import {ProjectService} from "../../services/project.service";
import {Project} from "../../infrastructures/types/project";

@Component({
  selector: 'app-projects-details',
  template: `
    <div class="project-details">
        <h3>Project Details</h3>
        <div *ngIf="project$ | async as project">
            <span>Project Name: {{project.name}}</span>
            <span>Project Descriptions: {{project.description}}</span>
            <span>Logo: {{project.image}}</span>
            <div class="subprojects">
                <span>SubProjects:</span>
                <app-project-card
                  *ngFor="let subProjectId of project.subProjectIds"
                  [projectId]="subProjectId"
                />
            </div>
        </div>
    </div>
  `,
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, ProjectCardComponent]
})
export class ProjectDetailsComponent implements OnChanges {
  @Input({transform: numberAttribute}) id!: number;
  private readonly projectService = inject(ProjectService);
  project$: Observable<Project> | null = null;

  ngOnChanges(changes: SimpleChanges){
    if(changes['id']) {
      this.project$ = this.projectService.getProject(this.id);
    }
  }

}
