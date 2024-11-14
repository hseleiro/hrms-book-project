import {Component, inject, Input, OnChanges, SimpleChanges} from "@angular/core";
import {AsyncPipe, NgIf} from "@angular/common";
import {ProjectService} from "../../services/project.service";
import {Observable} from "rxjs";
import {Project} from "../../infrastructures/types/project";

@Component({
  selector: 'app-project-card',
  template: `
        <div *ngIf="project$ | async as project" class="card">
            <img [src]="project.image" alt=""/>
            <div class="card-body">
                <h3>{{ project.name }}</h3>
            </div>
        </div>
    `,
  imports: [NgIf, AsyncPipe, AsyncPipe],
  standalone: true,
})
export class ProjectCardComponent implements OnChanges {
  private readonly projectService = inject(ProjectService);

  @Input() projectId!: number;
  project$: Observable<Project> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectId']) {
      this.project$ = this.projectService.getProject(this.projectId);
    }
  }
}
