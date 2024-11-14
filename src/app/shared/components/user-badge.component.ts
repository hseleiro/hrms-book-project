import {Component, Input} from "@angular/core";
import {NgClass, NgForOf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-user-badge',
  template: `
    <i *ngFor="let icon of icons" [ngClass]="'icon-'+icon"></i>
  `,
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf,
    NgClass
  ]
})
export class UserBadgeComponent {
  @Input() icons!: string[];
}
