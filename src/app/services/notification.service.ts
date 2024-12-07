import {computed, effect, inject, Injectable, signal} from "@angular/core";
import {Notification} from "../infrastructures/types/notifications";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SocketService} from "./socket-service.service";

@Injectable({providedIn: "root"})
export class NotificationService {
  private readonly socketService = inject(SocketService);

  //#notifications = toSignal(this.socketService.notifications$, {requireSync: true});

  #notifications = signal<Notification[]>(
    localStorage.getItem('notifications') ?
     JSON.parse(<string>localStorage.getItem('notifications')) : [],
  )

  notifications = this.#notifications.asReadonly();
  readNotifications = computed(() => this.#notifications().filter((notification) => notification.read));
  unreadNotifications = computed(() => this.#notifications().filter((notification) => !notification.read));

  constructor() {
    effect(() => {
      localStorage.setItem('notifications', JSON.stringify(this.#notifications()));
    })
  }

  connect() {
    return this.socketService.notifications$.pipe(
      takeUntilDestroyed(),
    ).subscribe(notifications =>
      this.#notifications.set(notifications)
    )
  }

  addNotification(notification: Notification) {
    this.#notifications.update((notifications) => [...notifications, notification])
  }

  markAsRead(notification: Notification) {
    this.#notifications.update((notifications) => notifications.map((n) =>
      n.id === notification.id ? {...n, read: true} : n
    ))
  }

  markAllAsRead() {
    this.#notifications.update((notification) =>
      notification.map((n) => ({...n, read: true}))
    )
  }

}
