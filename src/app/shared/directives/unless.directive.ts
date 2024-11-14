import {NgIf} from "@angular/common";
import {AfterViewInit, Directive, inject} from "@angular/core";

@Directive({
  selector: '[appUnless]',
  standalone: true,
  hostDirectives: [NgIf],
})
export class UnlessDirective implements AfterViewInit {
  private readonly ngIfRef = inject(NgIf);

  ngAfterViewInit() {
    this.ngIfRef.ngIf = !this.ngIfRef.ngIf;
  }

}
