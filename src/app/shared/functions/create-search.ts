import {FormControl} from "@angular/forms";
import {DestroyRef, inject} from "@angular/core";
import {debounceTime, Subject, takeUntil} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export function createSearch<T>(
  control: FormControl<T>,
) {
  const destroyRef = inject(DestroyRef)
  const destroy$ = new Subject<void>;
  destroyRef.onDestroy(() => destroy$.next());
  return control.valueChanges.pipe(
    takeUntilDestroyed(destroyRef),
    debounceTime(500),
    takeUntil(destroy$)
  )
}
