import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavMenusVisibilityService {
  areMenusVisibile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true,
  );
  visibiliyObservable: Observable<boolean> =
    this.areMenusVisibile.asObservable();

  toggleVisibility(): void {
    this.areMenusVisibile.next(!this.areMenusVisibile.value);
  }
}
