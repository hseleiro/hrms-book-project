import {Component, Inject} from "@angular/core";
import {DatePipe, NgFor, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TimeOffManagementService} from "../../services/time-off-management.service";
import {TimeOffRequest} from "../../infrastructures/types/time-off-request.type";

@Component({
  selector: 'app-time-off-management',
  template: `
    <h2>Time Off Management</h2>
    <table>
      <thead>
      <tr>
        <th>Employee</th>
        <th>Start Date</th>
        <th>End Date</th>
        <th>Type</th>
        <th>Status</th>
        <th>Comments</th>
        <th>Actions</th>
      </tr>
      <tbody>
      <tr *ngFor="let request of requests()">
        <td>{{ request.employeeId }}</td>
        <td>{{ request.startDate | date}} </td>
        <td>{{ request.endDate }}</td>
        <td>{{ request.type }}</td>
        <td>{{ request.status }}</td>
        <td>{{ request.comment }}</td>
        <td>
          <button *ngIf="request.status === 'Pending'">Approve</button>
          <button *ngIf="request.status === 'Pending'">Reject</button>
          <button (click)="deleteRequest(request)">Delete</button>
        </td>
      </tr>
      </tbody>
    </table>

    <br>

    <div>Resolved Requests {{resolvedRequests().length}} / {{unresolvedRequests().length}} Unresolved</div>

    <br>

    <select
        [ngModel]="selectedType()"
        (ngModelChange)="selectedType.set($any($event))">
      <option value="">All</option>
      <option value="Vacation">Vacation</option>
      <option value="Sick Leave">Sick Leave</option>
      <option value="Maternity Leave">Maternity Leave</option>
      <option value="Paternity">Paternity Leave</option>
      <option value="Other">Other</option>
    </select>

    <ng-container *ngIf="filteredRequestsByType().length > 0; else notFound">
      <li *ngFor="let request of filteredRequestsByType()">
        {{request.type}}
      </li>
    </ng-container>

    <ng-template #notFound>Not Found</ng-template>

    <div (click)="stopCount()">Stop Count</div>
    <div>Count: {{count()}}</div>

    <form [formGroup]="form">
      <input type="text" formControlName="type"/>
    </form>

  `,
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, FormsModule, ReactiveFormsModule]
})
export class TimeOffManagementComponent {
  private readonly timeOffService = Inject(TimeOffManagementService);
  requests = this.timeOffService.request;
  resolvedRequests = this.timeOffService.resolvedRequests;
  selectedType = this.timeOffService.selectedType

  approveRequest(request: TimeOffRequest) {
    this.timeOffService.approveRequest(request)
  }

  rejectRequest(request: TimeOffRequest) {
    this.timeOffService.rejectRequest(request)
  }

  deleteRequest(request: TimeOffRequest) {
    this.timeOffService.deleteRequest(request)
  }



















  /*private readonly injector = inject(Injector);
  private readonly timeOffRequestService = inject(TimeOffRequestsService)

  form = new FormGroup({
    type: new FormControl()
  })

  count = signal(0);

  log = effect(() => {
    console.log('count:', this.count())
  })

  stopCount() {
    this.log.destroy();
  }

  requests = toSignal(this.timeOffRequestService.getRequests(), {initialValue: []});

  /*requests = signal<TimeOffRequest[]>([
    {
      id: 1,
      employeeId: 1,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      type: 'Vacation',
      status:'Pending'
    },
    {
      id: 2,
      employeeId: 2,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      type: 'Sick Leave',
      status: 'Approved',
      comment: 'Feeling pretty sick today'
    }
  ]);*/

  /*selectedType = signal<
    'Vacation' |
    'Sick Leave' |
    'Maternity Leave' |
    'Paternity Leave' |
    'Other' |
    ''>(localStorage.getItem('selected type') as any ?? '')

  resolvedRequests = computed(() =>
    this.filteredRequestsByType().filter((r) => r.status !== 'Pending')
  );

  filteredRequestsByType = computed(() =>
    this.requests().filter((r) => r.type.toLowerCase().includes(this.selectedType().toLowerCase())
    )
  )

  unresolvedRequests = computed(() =>
    this.requests().filter(r => r.status === 'Pending')
  )

  constructor() {
    effect(() => {
      localStorage.setItem('selected type', this.selectedType());
    })
    //setInterval(() => this.count.update((c) => c + 1), 1_000);

    effect(() => {
      this.count() == 5 ? this.form.get('type')?.disable() : null
    })
  }*/

  /*approveRequest(request: TimeOffRequest) {
    this.requests.update((requests) => {
      const index = requests.findIndex((r) => r.id === request.id);
      return requests.map((item, i) => i === index ?
        ({...item, status: 'Approved'}) : item);
    });
  }

  rejectRequest(request: TimeOffRequest) {
    this.requests.update((requests) => {
      const index = requests.findIndex((r) => r.id === request.id)
      return requests.map((item, i) => i === index ? ({...item, status: 'Rejected'}) : item);
    })
  }*/

  // retorna me todos os que n foram selecionados
  /*deleteRequest(request: TimeOffRequest) {
    console.log('request', request);
    this.requests.update((requests) => {
      return requests.filter((r) => r.id !== request.id);
    })
  }*/

  /*deleteRequest(request: TimeOffRequest) {
    this.requests = toSignal(
      this.timeOffRequestService.deleteRequest(1).pipe(
        switchMap(() => this.timeOffRequestService.getRequests())
      )
    , {initialValue: this.requests(), injector: this.injector})
  }*/
}
