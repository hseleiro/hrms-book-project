import { HttpClient } from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import { Project } from "../infrastructures/types/project";

@Injectable()
export class ProjectService {
  private readonly http = inject(HttpClient);

  getProjects() {
    return this.http.get<Project[]>('/api/projects');
  }

  getProject(projectId: number) {
    return this.http.get<Project>(`/api/projects/${projectId}`);
  }
}
