import {computed, effect, inject, Injectable, signal} from "@angular/core";
import {TimeOffRequestsService} from "./time-off-requests.service";
import {TimeOffRequest} from "../infrastructures/types/time-off-request.type";
import {merge, Subject, switchMap} from "rxjs";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";

@Injectable({providedIn: "root"})
export class TimeOffManagementService {
  private readonly timeOfRequestService = inject(TimeOffRequestsService);
  deletedRequests$ = new Subject<TimeOffRequest>();
  approvedRequests$ = new Subject<TimeOffRequest>();
  rejectedRequests$ = new Subject<TimeOffRequest>();
  selectType = signal<
    'Vacation' | 'Sick Leave' | 'Maternity Leave' | 'Paternity Leave' | 'Other' | ''>((localStorage.getItem('selectedType') as any) ?? '');

  requests = toSignal(
    merge(
      toObservable(this.selectType),
      this.deletedRequests$.pipe(switchMap((r) =>
        this.timeOfRequestService.deleteRequest(r.id))),
      this.approvedRequests$.pipe(switchMap((r) =>
        this.timeOfRequestService.approveRequest(r.id))),
      this.rejectedRequests$.pipe(switchMap((r) =>
        this.timeOfRequestService.rejectRequest(r.id))),
    ).pipe(
      switchMap(() => {
        return this.timeOfRequestService.getRequestsByType(
          this.selectType()
        )
      })
    ),
    {
      initialValue: [] as TimeOffRequest[],
    }
  );

  resolvedRequests = computed(() =>
    this.requests().filter((r) => r.status !== 'Pending')
  )

  constructor() {
    effect(() => {
      localStorage.setItem('SelectedType', this.selectType());
    })
  }

  approveRequest(request: TimeOffRequest) {
    this.approvedRequests$.next(request)
  }

  rejectRequest(request: TimeOffRequest) {
    this.rejectedRequests$.next(request);
  }

  deleteRequest(request: TimeOffRequest) {
    this.deletedRequests$.next(request);
  }
}
