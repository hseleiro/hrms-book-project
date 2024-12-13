import {Component, inject, signal} from "@angular/core";
import {NgForOf, NgIf} from "@angular/common";
import {NotificationService} from "../../services/notification.service";
import {Notification} from "../../infrastructures/types/notifications";

@Component({
  selector: 'app-header',
  template: `
    <header>
      <h2>HRMS</h2>
      <button (click)="notificationsOpen.set(true)" title="View Notifications">
        You have {{ unreadNotifications.length }} unread notifications
      </button>
    </header>
    <dialog [open]="notificationsOpen()">
      <h3>Notifications</h3>
      <ul>
        <li *ngFor="let notification of notifications()">
          <h4>{{ notification.title }}</h4>
          <span>{{ notification.message }}</span>
          <button
            (click)="markNotificationsAsRead(notification)"
            *ngIf="!notification.read">
            Mark as read
          </button>
        </li>
      </ul>
      <button (click)="notificationsOpen.set(false)">Close</button>
    </dialog>
  `,
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class HeaderComponent {
  private readonly notificationService = inject(NotificationService);

  notifications = this.notificationService.notifications;
  unreadNotifications = this.notificationService.unreadNotifications;
  readNotifications = this.notificationService.readNotifications;

  notificationsOpen = signal(false);

  markNotificationsAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification);
  }

  constructor() {
    this.notificationService.connect();
  }

}
