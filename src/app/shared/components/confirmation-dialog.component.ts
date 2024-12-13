import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-confirmation-dialog',
  template: `
    <dialog [open]="isConfirmationOpen">
      There are multiple products with the same nif, do you want to select the same category ?
      <button (click)="onCancel()">Cancel</button>
      <button (click)="onConfirm()">Confirm</button>
    </dialog>
  `,
  standalone: true,
})
export class ConfirmationDialogComponent {
  @Input() isConfirmationOpen = true;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.isConfirmationOpen = false;
  }

  onCancel() {
    this.cancel.emit();
    this.isConfirmationOpen = false;
  }
}
