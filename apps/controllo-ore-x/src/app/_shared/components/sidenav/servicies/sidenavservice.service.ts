import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  sidebarOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  currentSidebarStatus: Observable<boolean> = this.sidebarOpen.asObservable();

  toggleVisibility(): void {
    this.sidebarOpen.next(!this.sidebarOpen.value);
  }
}
