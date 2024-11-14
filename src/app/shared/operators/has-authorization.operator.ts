import {filter, map, MonoTypeOperatorFunction, pipe, withLatestFrom} from "rxjs";
import {isAuth} from "../functions/is-auth";

export function hisAuthorized<T>(
): MonoTypeOperatorFunction<T> {

  return pipe(
    withLatestFrom(isAuth()),
    filter(([, isAuth]) => isAuth),
    map(([value]) => value)
  )

}
